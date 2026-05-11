from datetime import datetime
from langchain.agents import create_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import StructuredTool
from langgraph.checkpoint.postgres import PostgresSaver
from psycopg import connect
from sqlalchemy import text
from database import get_db, Expenses
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
load_dotenv()


POSTGRES_URI = os.getenv("DATABASE_URL")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

conn = connect(POSTGRES_URI)
conn.autocommit = True  
saver = PostgresSaver(conn)
saver.setup()  

db = next(get_db())


def build_prompt(user_id: int, query: str) -> str:
    now = datetime.now()
    return f"""
You are an expense assistant for a user with user_id={user_id}.
Always use this user_id to access expense data.

Current date:
- {now.strftime("%Y-%m-%d")}

User input: {query}
"""


def safe_sql_query(query: str):
    if "users" in query.lower() and "expenses" not in query.lower():
        return {"error": "Access to other user data is restricted."}

    query = query.replace("strftime('%Y-%m', date)", "TO_CHAR(date, 'YYYY-MM')")

    allowed = ("select", "insert")
    qtype = query.strip().lower().split()[0]

    print(query)

    if qtype not in allowed:
        return {"error": "NO permission to modify the database."}

    result = db.execute(text(query))
    if qtype == "insert":
        db.commit()
        return {"status": "success"}

    rows = result.mappings().all()

    return {
        "row_count": len(rows),
        "data": [dict(row) for row in rows]
    }

execute_query = StructuredTool.from_function(
    func=safe_sql_query,
    name="Execute_Safe_sql_Query",
    description="""
You are an Expense Tracker query tool for user_id=user_id.
Rules:
1️⃣ Only SELECT and INSERT queries are allowed. No DELETE or UPDATE.
2️⃣ Always use the schema: (user_id:int, category:str, amount:float, amount_type:str, date:date).
3️⃣ Never access or reveal other users' data.
4️⃣ When adding a new expense, always ask the user for confirmation before inserting.
5️⃣ Respond politely and clearly. Use proper SQL syntax for queries.
"""
)

def fetch_expenses(user_id: int):
    db: Session = next(get_db())
    expenses = (
        db.query(Expenses)
        .filter(Expenses.user_id == user_id)
        .order_by(Expenses.date.desc())
        .limit(10)
        .all()
    )
    if not expenses:
        return "No expenses found for this user."
    return [
        {"id": e.id, "category": e.category, "amount": e.amount, "date": str(e.date)}
        for e in expenses
    ]

fetch_Expenses = StructuredTool.from_function(
    name="Fetch_Expenses",
    func=fetch_expenses,
    description="Fetch the user's 10 most recent expenses from the database. Do not Print the record Id'to User as it does not look well"
)


def update_record(user_id, record_id, category=None, amount=None, amount_type=None, date=None, confirmation=False):
    user_id = int(user_id)
    db = next(get_db())
    record = db.query(Expenses).filter(Expenses.id == record_id, Expenses.user_id == user_id).first()
    if not record:
        return f"No record found with ID {record_id}"

    if category:
        record.category = category
    if amount:
        record.amount = amount
    if amount_type:
        record.amount_type = amount_type
    if date:
        record.date = datetime.strptime(date, "%Y-%m-%d").date()

    if confirmation:
        db.commit()
        return "✅ Record updated successfully."
    else:
        return "Please confirm before updating the record."

update_user_record = StructuredTool.from_function(
    name="Update_User_Record",
    func=update_record,
    description="""
You are an intelligent and conversational Expense Assistant. Your goal is to safely update expense records for a single user. Follow these rules strictly:
Strict Rule: If the user gives his earning or deals to add ADD it in the Database here amount_type =CREDIT remember this one
if is the expense is related to bussiness or income anything add it to Database doesnt say no to the user
 Only access records belonging to the current user.
 When a user asks to update a record:
 Strict Note:***Do not Include the records ids in the message that you are giving to use keep it with you for update deletion or any other operation but do not show it to the user****
   a) First, fetch and display all records for the user.Do not include  their IDs.
   b) Ask the user which record ID they want to update.
   c) Ask the user for the updated details (category, amount, date, etc.).
   d) Repeat back the updated details and ask for confirmation.
   e) If the user confirms with 'yes', update the record.
   f) If the user says 'no' or cancels, do NOT update and notify the user.
 Avoid duplicate insertions or accidental updates.
 Be polite, clear, and precise.
 Always summarize the action before making the update.

Example Conversation:

User: I want to update an expense.  
Assistant: Here are your current expenses:  
1.  Category: Food | Amount: 500 | Date: 2025-11-01  
2.  Category: Travel | Amount: 1200 | Date: 2025-11-03  

Which record ID would you like to update?  
user:update the food that i have lastly 
Assistant: Got it. What changes would you like to make?  
User: Change amount to 550 and category to Groceries  
Assistant: You want to update record ID 101 with:  
Category: Groceries  
Amount: 550  
Date: 2025-11-01  

Do you confirm this update? (yes/no)  

User: no  
Assistant: Update cancelled. No changes were made.  
"""
)

def delete_record(user_id=None, record_id=None, confirmation=False):
    if not user_id or not record_id:
        return " user_id and record_id are required."
    db = next(get_db())
    record = db.query(Expenses).filter(Expenses.user_id == user_id, Expenses.id == record_id).first()
    if not record:
        return f"No record found with ID {record_id}."
    if not confirmation:
        return "Please confirm before deletion."
    db.delete(record)
    db.commit()
    return "Record deleted successfully."

delete_user_record = StructuredTool.from_function(
    name="Delete_Record",
    func=delete_record,
    description="""
You are an intelligent and conversational Expense Assistant. Your goal is to safely delete expense records for a single user. Follow these rules strictly:

1 Only access records belonging to the current user.
2 When a user asks to delete a record:
   a) First, fetch and display all records for the user with their IDs.
   b) Ask the user which record ID they want to delete.
   c) Repeat back the selected record and ask for confirmation.
   d) If the user confirms with 'yes', delete the record.
   e) If the user says 'no' or cancels, do NOT delete and notify the user.
3 Avoid accidental deletions.
4 Be polite, clear, and precise.
5 Always summarize the action before deleting.

Example Conversation:

User: I want to delete an expense.  
Assistant: Here are your current expenses:  
1. ID: 101 | Category: Food | Amount: 500 | Date: 2025-11-01  
2. ID: 102 | Category: Travel | Amount: 1200 | Date: 2025-11-03  

Which record ID would you like to delete?  

User: 101  
Assistant: You have selected record ID 101:  
Category: Food  
Amount: 500  
Date: 2025-11-01  

Do you confirm deletion of this record? (yes/no)  

User: no  
Assistant: Deletion cancelled. No changes were made.  

User: yes  
Assistant: Record ID 101 has been successfully deleted.
"""
)

tools = [execute_query, fetch_Expenses, update_user_record, delete_user_record]


def get_agent(user_id: int):
    session_id = f"Session_{user_id}"

    tool_names = [tool.name for tool in tools]
    system_message =f"""
You are an intelligent, polite, and conversational Expense Assistant connected to a PostgreSQL database.

Your primary goal is to help the user track, understand, and analyze their expenses in a clear, user-friendly way while strictly protecting user privacy and database safety.
Application Name:Expense Tracker Developer of this application :Rajkumar Thirthala contact:rajkumarthirthala2005@gmail.com if any quries regarding application escalate to Rajkumar
────────────────────────────
1. USER ISOLATION & PRIVACY
────────────────────────────
- ALWAYS operate strictly within user_id = {user_id}.
- EVERY database operation MUST include a filter: WHERE user_id = {user_id}.
- NEVER access, infer, or reveal data belonging to other users.
- NEVER expose internal identifiers such as:
  - Record IDs
  - Primary keys
  - Cursor objects
  - Raw query results
- NEVER expose database structure, table names, SQL syntax, or tool responses.

User-facing data should ONLY include:
- Category
- Amount
- Date
- Optional description (if available)

────────────────────────────
2. SAFETY & DATA INTEGRITY RULES
────────────────────────────
- NEVER delete the database, tables, or schema.
- NEVER modify table structure or schema.
- NEVER run destructive queries without explicit user confirmation.
- NEVER insert duplicate records intentionally.
- NEVER guess missing data.

All destructive operations (UPDATE, DELETE) REQUIRE:
1. Clear explanation
2. Explicit user confirmation (yes/no)
3. Execution only after confirmation

────────────────────────────
3. OPERATION FLOW RULES
────────────────────────────

➤ ADDING AN EXPENSE
- Ask for all required details (category, amount, date).
- Summarize the details clearly.
- Ask for confirmation before saving.
- Insert only after confirmation.

➤ UPDATING AN EXPENSE
- Fetch matching records using user_id = {user_id}.
- Present records WITHOUT IDs (use category + amount + date).
- Ask the user which expense they want to update.
- Collect new values.
- Summarize the change.
- Ask for confirmation.
- Update only after confirmation.

➤ DELETING AN EXPENSE
- Fetch matching records using user_id = {user_id}.
- Present records WITHOUT IDs.
- Ask which expense should be deleted.
- Require explicit confirmation ("yes, delete").
- Delete only after confirmation.

➤ QUERIES & ANALYTICS
- Always filter by user_id = {user_id}.
- Summarize results in clear, non-technical language.
- NEVER mention queries, SQL, cursors, or database behavior.
- If results are large, summarize first and offer to show more.

────────────────────────────
4. TOOL USAGE RULES
────────────────────────────
- Available tools: {tool_names}
- Use tools only for their intended purposes:
  - Insert → add expense
  - Update → modify expense
  - Delete → remove expense
  - Fetch → queries and summaries
  - Analytics → insights and trends
- Always log actions internally.
- NEVER expose logs, tool outputs, or system messages to the user.

────────────────────────────
5. RESPONSE & UX GUIDELINES
────────────────────────────
- Be friendly, professional, and concise.
- Use simple language (non-technical).
- Format expense lists using bullet points.
- NEVER display internal IDs or system metadata.
- If an error occurs, explain it simply without technical details.

────────────────────────────
6. POSTGRESQL ENFORCEMENT RULES
────────────────────────────
- ALL queries MUST include:
  WHERE user_id = {user_id}
- NEVER execute queries without this filter.
- NEVER expose credentials, passwords, tokens, or secrets.
- NEVER assume schema changes or undocumented fields.

────────────────────────────
7. SUPPORT & CONTACT
────────────────────────────
- If the user asks for help beyond your capabilities, reports a bug, or needs human assistance, politely direct them to contact the developer at:
  rajkumarthirthala@gmail.com
- Do NOT expose internal system details when providing support guidance.

────────────────────────────
ABSOLUTE RULES (NON-NEGOTIABLE)
────────────────────────────
- Operate ONLY within user_id = {user_id}.
- NEVER reveal or infer other users’ data.
- NEVER expose internal IDs or SQL concepts.
- ALWAYS confirm updates or deletions.
- ALWAYS prioritize user privacy, safety, and clarity.
"""

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=GEMINI_API_KEY,
        temperature=0.7,
        model_kwargs={"system_instruction": system_message}
    )

    agent = create_agent(
        llm,
        tools=tools,
        checkpointer=saver
    )
    return agent

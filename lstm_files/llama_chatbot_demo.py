from pypdf import PdfReader
import ollama

file = "apple_financial_report.pdf"

reader = PdfReader(file)
number_of_pages = len(reader.pages)
text = ""

# for i in range(7, 19):
#     page = reader.pages[i]
#     text += page.extract_text()

page = reader.pages[30]
text = page.extract_text()

model = "llama3.2"

question_to_ask = "\n What was the difference between the net sales from 2022 to 2023"

prompt = text + question_to_ask

stream = ollama.chat(
    model = model,
    messages = [{'role': 'user', 'content': prompt}],
    stream = True,
)

for chunk in stream:
    print(chunk['message']['content'], end='')
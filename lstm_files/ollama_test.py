import ollama

model = "llama3.2"

prompt = """
    What colour is the sky?
"""

stream = ollama.chat(
    model = model,
    messages = [{'role': 'user', 'content': prompt}],
    stream = True,
)

for chunk in stream:
    print(chunk['message']['content'], end='')
    
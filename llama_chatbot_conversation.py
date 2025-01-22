import ollama

# Model setup
model = "llama3.2"

def ask_question(prompt_text, model_name):
    """
    Function to ask a question to the model and get a response.
    """
    stream = ollama.chat(
        model=model_name,
        messages=[{'role': 'user', 'content': prompt_text}],
        stream=True,
    )
    for chunk in stream:
        print(chunk['message']['content'], end='')
    print()

# Initial question
question = "\nIntroduce yourself and ask the user if they have any question about any stocks in a short paragraph."

while True:
    # Combine the extracted text with the question
    prompt = question
    
    # Ask the question
    ask_question(prompt, model)
    
    # Check if the user has more questions
    question = input("\nQuery - (Type 'quit' to exit): ")
    print()
    
    if question.lower() == "quit":
        print("Goodbye!")
        print()
        break

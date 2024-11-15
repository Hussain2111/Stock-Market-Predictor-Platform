import tkinter as tk
from tkinter import ttk
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.pyplot as plt
import numpy as np

# Create the main window
root = tk.Tk()
root.title("Stock Market Predictor")
root.geometry("1000x700")  # Increase the window size

# Main Frame (to divide left and right sections)
main_frame = tk.Frame(root)
main_frame.pack(fill=tk.BOTH, expand=True)

# Left Section (Company Name and Search Bar)
left_frame = tk.Frame(main_frame, width=300, bg="lightgrey")
left_frame.pack(side=tk.LEFT, fill=tk.BOTH, padx=20, pady=20)

# Company Name
company_name = tk.Label(left_frame, text="Apple Inc.", font=("Helvetica", 20), bg="lightgrey")
company_name.pack(pady=10)

# Search Bar
search_frame = tk.Frame(left_frame, bg="lightgrey")
search_frame.pack(pady=20)

search_label = tk.Label(search_frame, text="Search:", font=("Helvetica", 12), bg="lightgrey")
search_label.pack(side=tk.LEFT, padx=5)

search_entry = ttk.Entry(search_frame, width=20)
search_entry.pack(side=tk.LEFT, padx=5)

search_button = ttk.Button(search_frame, text="Search")
search_button.pack(side=tk.LEFT, padx=5)

# Right Section (Graph, Stock Prices, and Analysis)
right_frame = tk.Frame(main_frame, width=700)
right_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=20, pady=20)

# Market Data Section
market_frame = tk.Frame(right_frame)
market_frame.pack(fill=tk.X, pady=10)

market_cap_label = tk.Label(market_frame, text="Market Cap:", font=("Helvetica", 12))
market_cap_label.pack(side=tk.LEFT, padx=5)

market_cap_value = tk.Label(market_frame, text="$2.5T", font=("Helvetica", 12))
market_cap_value.pack(side=tk.LEFT, padx=5)

stock_price_label = tk.Label(market_frame, text="Stock Price:", font=("Helvetica", 12))
stock_price_label.pack(side=tk.LEFT, padx=20)

stock_price_value = tk.Label(market_frame, text="$150.00", font=("Helvetica", 12))
stock_price_value.pack(side=tk.LEFT)

# Prediction Section (Graph and Options)
prediction_frame = tk.LabelFrame(right_frame, text="Prediction", font=("Helvetica", 14))
prediction_frame.pack(fill=tk.BOTH, expand=True, pady=20)

# Prediction Options
days_frame = tk.Frame(prediction_frame)
days_frame.pack(pady=10)

day_buttons = [("1 Day", 1), ("7 Day", 7), ("14 Day", 14), ("28 Day", 28)]
for (text, value) in day_buttons:
    button = ttk.Button(days_frame, text=text)
    button.pack(side=tk.LEFT, padx=5)

# Sample Prediction Graph (Placeholder)
fig, ax = plt.subplots()
x = np.linspace(0, 30, 100)
y = np.sin(x) * np.exp(-0.1 * x)  # Sample prediction curve
ax.plot(x, y)
ax.set_title("Stock Prediction")
ax.set_xlabel("Days")
ax.set_ylabel("Price")

canvas = FigureCanvasTkAgg(fig, master=prediction_frame)
canvas.draw()
canvas.get_tk_widget().pack(pady=10)

# Run the application
root.mainloop()
import tkinter as tk
from tkinter import ttk, messagebox
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime, timedelta
from stock_llm_predictor import StockLLMPredictor

class StockPredictorApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Stock Market Predictor")
        self.root.geometry("1200x800")
        self.root.configure(bg="#e9ecef")
        
        self.setup_styles()
        self.create_main_window()
        
    def setup_styles(self):
        """Configure ttk styles for a modern look"""
        style = ttk.Style()
        style.configure("Custom.TEntry",
                       fieldbackground="#ffffff",
                       background="#ffffff",
                       padding=10)
        style.configure("Custom.TButton",
                       padding=10,
                       background="#007bff")
                       
    def create_main_window(self):
        """Setup the main window components"""
        self.main_frame = tk.Frame(self.root, bg="#e9ecef")
        self.main_frame.pack(fill=tk.BOTH, expand=True)
        
        self.create_header()
        self.create_search_bar()
        
    def create_header(self):
        """Create the header with title and description"""
        header_frame = tk.Frame(self.main_frame, bg="#e9ecef")
        header_frame.pack(fill=tk.X, pady=20)
        
        title = tk.Label(header_frame,
                        text="Stock Market Predictor",
                        font=("Helvetica", 24, "bold"),
                        bg="#e9ecef",
                        fg="#2c3e50")
        title.pack()
        
        description = tk.Label(header_frame,
                             text="Enter a stock symbol to view predictions and analysis",
                             font=("Helvetica", 12),
                             bg="#e9ecef",
                             fg="#7f8c8d")
        description.pack(pady=5)
        
    def create_search_bar(self):
        """Create the search interface"""
        search_frame = tk.Frame(self.main_frame, bg="#e9ecef")
        search_frame.pack(side=tk.BOTTOM, pady=50, fill=tk.X, padx=20)
        
        entry_frame = tk.Frame(search_frame, bg="#e9ecef", bd=2, relief=tk.SUNKEN)
        entry_frame.pack(fill=tk.X, padx=20)
        
        self.search_entry = ttk.Entry(entry_frame,
                                    width=40,
                                    font=("Helvetica", 12),
                                    style="Custom.TEntry")
        self.search_entry.insert(0, "Enter Stock Symbol")
        self.search_entry.bind('<FocusIn>', self.on_entry_click)
        self.search_entry.bind('<FocusOut>', self.on_focusout)
        self.search_entry.bind('<Return>', lambda e: self.search_stock())
        self.search_entry.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        search_button = ttk.Button(entry_frame,
                                 text="Search",
                                 style="Custom.TButton",
                                 command=self.search_stock)
        search_button.pack(side=tk.RIGHT)
        
    def open_stock_page(self, stock_symbol):
        """Create a new window for stock details"""
        stock_window = StockDetailWindow(self.root, stock_symbol)
        
    def search_stock(self):
        """Handle stock search"""
        stock_symbol = self.search_entry.get()
        if stock_symbol and stock_symbol != "Enter Stock Symbol":
            self.open_stock_page(stock_symbol.upper())
        else:
            messagebox.showwarning("Invalid Input", "Please enter a valid stock symbol")
            
    def on_entry_click(self, event):
        """Handle search entry click"""
        if self.search_entry.get() == "Enter Stock Symbol":
            self.search_entry.delete(0, "end")
            self.search_entry.config(foreground='black')
            
    def on_focusout(self, event):
        """Handle search entry focus out"""
        if self.search_entry.get() == "":
            self.search_entry.insert(0, "Enter Stock Symbol")
            self.search_entry.config(foreground='grey')
            
    def run(self):
        """Start the application"""
        self.root.mainloop()

class StockDetailWindow:
    def __init__(self, parent, stock_symbol):
        self.window = tk.Toplevel(parent)
        self.window.title(f"Stock Details - {stock_symbol}")
        self.window.geometry("1000x700")
        self.window.configure(bg="#e9ecef")
        
        self.stock_symbol = stock_symbol
        self.llm_predictor = StockLLMPredictor()
        self.create_layout()
        
    def create_layout(self):
        """Create the main layout for stock details"""
        main_frame = tk.Frame(self.window, bg="#e9ecef")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        self.create_left_panel(main_frame)
        self.create_right_panel(main_frame)
        
    def create_left_panel(self, parent):
        """Create the left panel with chatbot interface"""
        left_frame = tk.Frame(parent, width=300, bg="#e9ecef")
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, padx=20, pady=20)
        
        chatbot_label = tk.Label(left_frame,
                               text="AI Assistant",
                               font=("Helvetica", 20, "bold"),
                               bg="#e9ecef",
                               fg="black")
        chatbot_label.pack(pady=10)
        
        self.chat_area = tk.Text(left_frame,
                                height=20,
                                width=30,
                                bg="#ffffff",
                                wrap=tk.WORD,
                                font=("Helvetica", 10))
        self.chat_area.pack(pady=10)
        self.chat_area.config(state=tk.DISABLED)
        
        self.msg_entry = ttk.Entry(left_frame, width=30)
        self.msg_entry.pack(pady=10)
        
        send_button = ttk.Button(left_frame,
                               text="Send",
                               command=self.send_message)
        send_button.pack(pady=10)
        
        # Add initial greeting
        self.add_bot_message(f"Hello! I'm your AI assistant for {self.stock_symbol}. "
                           "How can I help you analyze this stock?")
        
    def create_right_panel(self, parent):
        """Create the right panel with stock information and charts"""
        right_frame = tk.Frame(parent, width=700, bg="#e9ecef")
        right_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        self.create_market_info(right_frame)
        self.create_prediction_section(right_frame)
        
    def create_market_info(self, parent):
        """Create the market information section"""
        market_frame = tk.Frame(parent, bg="#e9ecef")
        market_frame.pack(fill=tk.X, pady=10)
        
        # Sample data - in a real app, this would be fetched from an API
        info_pairs = [
            ("Market Cap", "$2.5T"),
            ("Stock Price", "$150.00"),
            ("24h Change", "+2.5%"),
            ("Volume", "12.5M")
        ]
        
        for label, value in info_pairs:
            container = tk.Frame(market_frame, bg="#e9ecef")
            container.pack(side=tk.LEFT, padx=10)
            
            tk.Label(container,
                    text=label,
                    font=("Helvetica", 12),
                    bg="#e9ecef",
                    fg="#7f8c8d").pack()
            
            tk.Label(container,
                    text=value,
                    font=("Helvetica", 12, "bold"),
                    bg="#e9ecef",
                    fg="#2c3e50").pack()
            
    def create_prediction_section(self, parent):
        """Create the prediction graph section"""
        prediction_frame = tk.LabelFrame(parent,
                                       text="Price Prediction",
                                       font=("Helvetica", 14, "bold"),
                                       bg="#e9ecef",
                                       fg="black")
        prediction_frame.pack(fill=tk.BOTH, expand=True, pady=20)
        
        days_frame = tk.Frame(prediction_frame, bg="#e9ecef")
        days_frame.pack(pady=10)
        
        day_buttons = [("1 Day", 1), ("7 Days", 7), ("14 Days", 14), ("28 Days", 28)]
        for text, days in day_buttons:
            ttk.Button(days_frame,
                      text=text,
                      command=lambda d=days: self.update_graph(d)).pack(side=tk.LEFT, padx=5)
        
        self.fig, self.ax = plt.subplots(figsize=(8, 6))
        self.canvas = FigureCanvasTkAgg(self.fig, master=prediction_frame)
        self.canvas.draw()
        self.canvas.get_tk_widget().pack(pady=10)
        
        self.update_graph(1)  # Initialize with 1-day prediction
        
    def update_graph(self, days):
        """Update the prediction graph"""
        self.ax.clear()
        
        current_price = 150  # Replace with actual current price
        dates, predictions, reasoning = self.llm_predictor.get_price_predictions(
            self.stock_symbol, 
            current_price, 
            days
        )
        
        # Update the graph with predictions
        self.ax.plot(dates, predictions, 'b-', label='Predicted Price')
        
        # Add confidence interval
        self.ax.fill_between(dates, 
                            [p * 0.95 for p in predictions], 
                            [p * 1.05 for p in predictions], 
                            color='blue', 
                            alpha=0.1)
        
        # Update the chat area with reasoning
        self.add_bot_message(f"Analysis: {reasoning}")
        
        # Add labels and styling
        self.ax.set_title(f"{self.stock_symbol} Price Prediction - Next {days} Days",
                         fontsize=12,
                         pad=15)
        self.ax.set_xlabel("Days")
        self.ax.set_ylabel("Price ($)")
        self.ax.grid(True, linestyle='--', alpha=0.7)
        self.ax.legend()
        
        # Format y-axis as currency
        self.ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, p: f'${x:,.2f}'))
        
        self.canvas.draw()
        
    def send_message(self):
        """Handle sending messages in the chatbot"""
        message = self.msg_entry.get().strip()
        if message:
            self.add_user_message(message)
            self.msg_entry.delete(0, tk.END)
            
            # Simple response system - replace with real AI responses
            responses = [
                f"Based on the current trends for {self.stock_symbol}, I see positive momentum.",
                f"The technical indicators for {self.stock_symbol} suggest caution.",
                f"Looking at {self.stock_symbol}'s fundamentals, the P/E ratio is within industry average.",
                "Would you like me to analyze any specific metrics for this stock?"
            ]
            self.add_bot_message(np.random.choice(responses))
            
    def add_user_message(self, message):
        """Add a user message to the chat area"""
        self.chat_area.config(state=tk.NORMAL)
        self.chat_area.insert(tk.END, "\nYou: " + message + "\n")
        self.chat_area.see(tk.END)
        self.chat_area.config(state=tk.DISABLED)
        
    def add_bot_message(self, message):
        """Add a bot message to the chat area"""
        self.chat_area.config(state=tk.NORMAL)
        self.chat_area.insert(tk.END, "\nBot: " + message + "\n")
        self.chat_area.see(tk.END)
        self.chat_area.config(state=tk.DISABLED)

if __name__ == "__main__":
    app = StockPredictorApp()
    app.run()
import tkinter as tk
from tkinter import ttk, messagebox
import yfinance as yf
from Stock_Predictor import StockPredictor
from Theme import ThemeManager


class StockSearchWindow :
    
    """
    Main application window class for the Stock Market Predictor.
    Handles the initial UI and stock search functionality.
    """
    def __init__(self):
        # Initialize main window
        self.root = tk.Tk()
        self.root.title("Stock Market Predictor")
        self.root.geometry("1200x800")
        
        # Initialize theme manager
        self.theme_manager = ThemeManager()
        self.theme_manager.setup_styles()
        
        self.setup_theme_toggle()
        self.apply_theme()
        self.create_main_window()
    
    def setup_theme_toggle(self):
        """Create theme toggle button"""
        self.theme_button = ttk.Button(
            self.root,
            text="Toggle Theme",
            command=self.toggle_theme,
            style=f"{self.theme_manager.current_theme}.TButton"
        )
        self.theme_button.pack(anchor='ne', padx=10, pady=5)
    
    def toggle_theme(self):
        """Handle theme toggle"""
        theme = self.theme_manager.toggle_theme()
        self.apply_theme()
    
    def apply_theme(self):
        """Apply current theme to all widgets"""
        theme = self.theme_manager.get_current_theme()
        
        # Update root window
        self.root.configure(bg=theme["bg"])
        
        # Update all frames recursively
        for widget in self.root.winfo_children():
            self.update_widget_theme(widget, theme)
    
    def update_widget_theme(self, widget, theme):
        """Recursively update widget themes"""
        widget_type = widget.winfo_class()
        
        if widget_type in ('Frame', 'Labelframe'):
            widget.configure(bg=theme["bg"])
        elif widget_type == 'Label':
            widget.configure(bg=theme["bg"], fg=theme["fg"])
        elif widget_type == 'Entry':
            widget.configure(bg=theme["entry_bg"], fg=theme["text"])
        elif widget_type == 'Text':
            widget.configure(bg=theme["entry_bg"], fg=theme["text"])
        
        # Update chart if it exists
        if hasattr(self, 'fig'):
            self.fig.set_facecolor(theme["chart_bg"])
            self.ax.set_facecolor(theme["chart_bg"])
            self.ax.grid(color=theme["grid_color"])
            self.canvas.draw()
        
        # Recursively update children
        for child in widget.winfo_children():
            self.update_widget_theme(child, theme)
    
    def create_main_window(self):
        """Create the main application window layout"""
        # Create header
        header_frame = tk.Frame(self.root, bg="#e9ecef")
        header_frame.pack(fill=tk.X, pady=20)
        
        title = tk.Label(
            header_frame,
            text="Stock Market Analyzer",
            font=("Helvetica", 24, "bold"),
            bg="#e9ecef",
            fg="#2c3e50"
        )
        title.pack()
        
        # Create UI components
        self.create_search_bar()
        self.create_instructions()
        self.create_recent_searches()
    
    def create_search_bar(self):
        """Create the stock symbol search bar"""
        search_frame = tk.Frame(self.root, bg="#e9ecef")
        search_frame.pack(pady=20, fill=tk.X, padx=20)
        
        # Create search entry with sunken effect
        entry_frame = tk.Frame(search_frame, bg="#e9ecef", bd=2, relief=tk.SUNKEN)
        entry_frame.pack(fill=tk.X, padx=20)
        
        # Create search entry with placeholder
        self.search_entry = ttk.Entry(
            entry_frame,
            width=40,
            font=("Helvetica", 12),
            style="Custom.TEntry"
        )
        self.search_entry.insert(0, "Enter Stock Symbol")
        self.search_entry.bind('<FocusIn>', self.on_entry_click)
        self.search_entry.bind('<FocusOut>', self.on_focusout)
        self.search_entry.bind('<Return>', lambda e: self.search_stock())
        self.search_entry.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Create search button
        search_button = ttk.Button(
            entry_frame,
            text="Search",
            style="Custom.TButton",
            command=self.search_stock
        )
        search_button.pack(side=tk.RIGHT)
    
    def create_instructions(self):
        """Create the instructions panel"""
        instructions_frame = tk.LabelFrame(
            self.root,
            text="Instructions",
            font=("Helvetica", 12, "bold"),
            bg="#e9ecef",
            fg="#2c3e50",
            padx=20,
            pady=10
        )
        instructions_frame.pack(padx=50, pady=20, fill=tk.X)
        
        instructions = [
            "1. Enter a stock symbol (e.g., AAPL for Apple, GOOGL for Google)",
            "2. Click 'Search' or press Enter to view detailed analysis",
            "3. View current market data and historical performance",
            "4. Check AI-powered price predictions",
            "5. Use the chat assistant for any questions"
        ]
        
        for instruction in instructions:
            tk.Label(
                instructions_frame,
                text=instruction,
                font=("Helvetica", 11),
                bg="#e9ecef",
                fg="#2c3e50",
                anchor="w"
            ).pack(fill=tk.X, pady=2)
    
    def create_recent_searches(self):
        """Create the recent searches section with sample stocks"""
        recent_frame = tk.LabelFrame(
            self.root,
            text="Recent Searches",
            font=("Helvetica", 12, "bold"),
            bg="#e9ecef",
            fg="#2c3e50",
            padx=20,
            pady=10
        )
        recent_frame.pack(padx=50, pady=20, fill=tk.X)
        
        # Add sample stocks (replace with actual recent searches in production)
        recent_stocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]
        for stock in recent_stocks:
            stock_button = ttk.Button(
                recent_frame,
                text=stock,
                command=lambda s=stock: self.search_stock(s)
            )
            stock_button.pack(side=tk.LEFT, padx=5, pady=5)

    # Event Handlers
    def search_stock(self, symbol=None):
        """Handle stock search and create detail window"""
        if symbol is None:
            symbol = self.search_entry.get().strip().upper()
            
        if not symbol:
            messagebox.showwarning("Invalid Input", "Please enter a stock symbol")
            return
            
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            StockPredictor(self.root, symbol, info)
        except Exception as e:
            messagebox.showerror("Error", f"Error fetching data for {symbol}")
    
    def on_entry_click(self, event):
        """Handle search entry focus in - clear placeholder"""
        if self.search_entry.get() == "Enter Stock Symbol":
            self.search_entry.delete(0, "end")
            self.search_entry.config(foreground='black')
    
    def on_focusout(self, event):
        """Handle search entry focus out - restore placeholder if empty"""
        if self.search_entry.get() == "":
            self.search_entry.insert(0, "Enter Stock Symbol")
            self.search_entry.config(foreground='grey')
    
    def run(self):
        """Start the application main loop"""
        self.root.mainloop()

if __name__ == "__main__":
    app = StockSearchWindow ()
    app.run()
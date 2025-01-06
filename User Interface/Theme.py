from tkinter import ttk

class ThemeManager:
    """Manages application themes including colors and styles"""
    
    THEMES = {
        "light": {
            "bg": "#e9ecef",
            "fg": "#2c3e50",
            "accent": "#007bff",
            "secondary_bg": "#f8f9fa",
            "text": "black",
            "entry_bg": "#ffffff",
            "chart_bg": "#ffffff",
            "grid_color": "#e0e0e0",
            "plot_color": "#007bff",
            "prediction_color": "#dc3545",
            "confidence_color": "rgba(220,53,69,0.1)"
        },
        "dark": {
            "bg": "#1a1a1a",
            "fg": "#ffffff",
            "accent": "#0d6efd",
            "secondary_bg": "#2d2d2d",
            "text": "#ffffff",
            "entry_bg": "#3d3d3d",
            "chart_bg": "#2d2d2d",
            "grid_color": "#404040",
            "plot_color": "#0d6efd",
            "prediction_color": "#dc3545",
            "confidence_color": "rgba(220,53,69,0.1)"
        }
    }
    
    def __init__(self):
        self.current_theme = "light"
        
    def setup_styles(self):
        """Configure ttk styles for both themes"""
        style = ttk.Style()
        
        # Light theme styles
        style.configure("Light.TFrame", background=self.THEMES["light"]["bg"])
        style.configure("Light.TLabel", 
                       background=self.THEMES["light"]["bg"],
                       foreground=self.THEMES["light"]["fg"])
        style.configure("Light.TButton",
                       background=self.THEMES["light"]["accent"],
                       foreground=self.THEMES["light"]["text"])
        style.configure("Light.TEntry",
                       fieldbackground=self.THEMES["light"]["entry_bg"])
        
        # Dark theme styles
        style.configure("Dark.TFrame", background=self.THEMES["dark"]["bg"])
        style.configure("Dark.TLabel",
                       background=self.THEMES["dark"]["bg"],
                       foreground=self.THEMES["dark"]["fg"])
        style.configure("Dark.TButton",
                       background=self.THEMES["dark"]["accent"],
                       foreground=self.THEMES["dark"]["text"])
        style.configure("Dark.TEntry",
                       fieldbackground=self.THEMES["dark"]["entry_bg"])

    def get_current_theme(self):
        """Get current theme colors"""
        return self.THEMES[self.current_theme]

    def toggle_theme(self):
        """Toggle between light and dark themes"""
        self.current_theme = "dark" if self.current_theme == "light" else "light"
        return self.get_current_theme()


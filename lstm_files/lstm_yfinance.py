import math
import numpy as np
import pandas as pd
import seaborn as sns
import yfinance as yf
sns.set_style('whitegrid')
import matplotlib.pyplot as plt
plt.style.use("fivethirtyeight")

import keras
from keras.models import Sequential
from keras.callbacks import EarlyStopping
from keras.layers import Dense, LSTM, Dropout

from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error

ticker = 'AAPL'

df = yf.download(ticker, 
                 start = '2000-01-01',
                 end = '2024-12-31',
                 multi_level_index = False)

info = yf.Ticker(ticker)

# Plotting the single feature lstm
plt.figure(figsize=(15, 6))
df['Open'].plot()
df['Close'].plot()
plt.ylabel(None)
plt.xlabel(None)
plt.title("Opening & Closing Price of {ticker}".format(ticker = ticker))
plt.legend(['Open Price', 'Close Price'])
plt.tight_layout()
plt.show()

# Preprocessing of the dataset
dataset = df["Close"]
dataset = pd.DataFrame(dataset)

data = dataset.values

data.shape

# MinMax scalar to normalise the values
scaler = MinMaxScaler(feature_range= (0, 1))
scaled_data = scaler.fit_transform(np.array(data).reshape(-1, 1))

# 75% to Train , 25% to Test
train_size = int(len(data)*.75)
test_size = len(data) - train_size

print("Train Size :",train_size,"Test Size :",test_size)

train_data = scaled_data[ :train_size , 0:1 ]
test_data = scaled_data[ train_size-14: , 0:1 ]
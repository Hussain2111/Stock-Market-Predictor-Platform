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

train_data.shape, test_data.shape

# Creating a Training set with 14 time-steps and 1 output
x_train = []
y_train = []

for i in range(14, len(train_data)):
    x_train.append(train_data[i-14:i, 0])
    y_train.append(train_data[i, 0])

# Convert to numpy array
x_train, y_train = np.array(x_train), np.array(y_train)

# Reshaping the input
x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

x_train.shape , y_train.shape

model = Sequential([
    LSTM(150, return_sequences= True, input_shape= (x_train.shape[1], 1)),
    LSTM(64, return_sequences= False),
    Dense(32),
    Dense(16),
    Dense(1)
])

model.compile(optimizer= 'adam', loss= 'mse')

model.summary()

# Fitting the LSTM to the Training set
callbacks = [EarlyStopping(monitor= 'loss', patience= 10 , restore_best_weights= True)]

history = model.fit(x_train, y_train, epochs= 500, batch_size= 16 , callbacks= callbacks )

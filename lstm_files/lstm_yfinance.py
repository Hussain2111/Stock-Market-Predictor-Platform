import sys
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

# Get ticker from command line argument
if len(sys.argv) < 2:
    print("Error: No ticker symbol provided")
    sys.exit(1)
    
ticker = sys.argv[1]
print(f"Starting prediction for ticker: {ticker}")

df = yf.download(ticker, 
                 start = '2000-01-01',
                 end = '2024-12-31',
                 multi_level_index = False)

print(f"Downloaded data for {ticker}:")
print(f"Data shape: {df.shape}")
print(f"Date range: {df.index[0]} to {df.index[-1]}")

info = yf.Ticker(ticker)

# Plotting the single feature lstm
plt.figure(figsize=(15, 6))
df['Open'].plot()
df['Close'].plot()
plt.ylabel(None)
plt.xlabel(None)
plt.title(f"Opening & Closing Price of {ticker}")
plt.legend(['Open Price', 'Close Price'])
plt.tight_layout()
plt.show()

# Preprocessing of the dataset
dataset = df["Close"]
dataset = pd.DataFrame(dataset)

data = dataset.values

# MinMax scalar to normalise the values
scaler = MinMaxScaler(feature_range= (0, 1))
scaled_data = scaler.fit_transform(np.array(data).reshape(-1, 1))

# 75% to Train , 25% to Test
train_size = int(len(data)*.75)
test_size = len(data) - train_size

print(f"Train Size : {train_size} Test Size : {test_size}")

train_data = scaled_data[ :train_size , 0:1 ]
test_data = scaled_data[ train_size-14: , 0:1 ]

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

model = Sequential([
    LSTM(150, return_sequences= True, input_shape= (x_train.shape[1], 1)),
    LSTM(64, return_sequences= False),
    Dense(32),
    Dense(16),
    Dense(1)
])

model.compile(optimizer= 'adam', loss= 'mse')

# Fitting the LSTM to the Training set
callbacks = [EarlyStopping(monitor= 'loss', patience= 10 , restore_best_weights= True)]

history = model.fit(x_train, y_train, epochs= 500, batch_size= 16 , callbacks= callbacks )

plt.plot(history.history["loss"])
plt.legend(['Mean Squared Error','Mean Absolute Error'])
plt.title("Losses")
plt.xlabel("epochs")
plt.ylabel("loss")
plt.show()

# Creating a testing set with 14 time-steps and 1 output
x_test = []
y_test = []

for i in range(14, len(test_data)):
    x_test.append(test_data[i-14:i, 0])
    y_test.append(test_data[i, 0])
x_test, y_test = np.array(x_test), np.array(y_test)
x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

#inverse y_test scaling
predictions = model.predict(x_test)

#inverse predictions scaling
predictions = scaler.inverse_transform(predictions)

#inverse y_test scaling
y_test = scaler.inverse_transform([y_test])

RMSE = np.sqrt(np.mean(( y_test - predictions )**2)).round(2)
print(f"\nRoot Mean Square Error: {RMSE}")

train = dataset.iloc[:train_size , 0:1]
test = dataset.iloc[train_size: , 0:1]
test['Predictions'] = predictions

plt.figure(figsize= (30, 15))
plt.title(f'{ticker} Close Stock Price Prediction', fontsize= 18)
plt.xlabel('Date', fontsize= 18)
plt.ylabel('Close Price', fontsize= 18)
plt.plot(train['Close'], linewidth= 3)
plt.plot(test['Close'], linewidth= 3)
plt.plot(test["Predictions"], linewidth= 3)
plt.legend(['Train', 'Test', 'Predictions'])
plt.show()
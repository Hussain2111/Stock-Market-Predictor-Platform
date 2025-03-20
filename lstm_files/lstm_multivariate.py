import math
import datetime
import numpy as np
import pandas as pd
import seaborn as sns
import yfinance as yf
sns.set_style('whitegrid')
import matplotlib.pyplot as plt
plt.style.use("fivethirtyeight")
import os
import keras
import locale
from keras.models import Sequential
from keras.callbacks import EarlyStopping
from keras.layers import Dense, LSTM, Dropout
from keras.optimizers import Adam, SGD

from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, accuracy_score


# Set UTF-8 encoding for output
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Choose the number of features used the time steps for learning

FEATURES = 6
TIMESTEPS = 14
STOCK = 'SBUX'

start = '2017-01-01'
end = '2025-01-01'

# These are commented becaused already imported and saved for easy access

df = yf.download('^VIX', 
                 start = start,
                 end = end,
                 multi_level_index = False)

df.to_csv('data/vix_dataset.csv')

df = yf.download('DX-Y.NYB', 
                 start = start,
                 end = end,
                 multi_level_index = False)

df.to_csv('data/usdx_dataset.csv')

df = yf.download(STOCK, 
                 start = start,
                 end = end,
                 multi_level_index = False)

df.to_csv('data/test_dataset.csv')

vix_temp = pd.read_csv('data/vix_dataset.csv')
vix_temp = vix_temp['Close']

usdx_temp = pd.read_csv('data/usdx_dataset.csv')
usdx_temp = usdx_temp['Close']

umcsent_temp = pd.read_csv('data/UMCSENT.csv')
umcsent_temp = umcsent_temp['UMCSENT']

unrate_temp = pd.read_csv('data/UNRATE.csv')
unrate_temp = unrate_temp['UNRATE']

effr_temp = pd.read_csv('data/EFFR.csv')
effr_temp = effr_temp['EFFR']

df = pd.read_csv('data/test_dataset.csv')
df['vix'] = vix_temp
df['usdx'] = usdx_temp
df['UNRATE'] = unrate_temp
df['UMCSENT'] = umcsent_temp
df['EFFR'] = effr_temp
df = df.set_index('Date')

df['EFFR'] = df['EFFR'].fillna(0)

# NOTE: OPTIONAL PLOT TO CHECK ALL THE DATA IS PULLED ACCURATELY
#
# plt.figure(figsize=(15, 6))
# df['Open'].plot()
# df['Close'].plot()
# df['vix'].plot()
# df['usdx'].plot()
# df['UNRATE'].plot()
# df['UMCSENT'].plot()
# df['EFFR'].plot()
# plt.ylabel(None)
# plt.xlabel(None)
# plt.legend(['Open', 'Close Price', 'VIX', 'USDX', 'UNRATE', 'UMCSENT', 'EFFR'])
# plt.tight_layout()
# plt.show()

dataset = df[['Open', 'vix', 'usdx', 'UNRATE', 'UMCSENT', 'EFFR']]
close_predictions = df[['Close']]

dataset = pd.DataFrame(dataset)
close_predictions = pd.DataFrame(close_predictions)

data = dataset.values
close = close_predictions.values

data.shape

scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(data)
scaled_close = scaler.fit_transform(close)

# 80% to Train , 20% to Test
train_size = int(len(data)*.80)
test_size = len(data) - train_size

print("Train Size :",train_size,"Test Size :",test_size)

train_data = scaled_data[ :train_size , : ]
train_y = scaled_close[ :train_size, : ]

test_data = scaled_data[ train_size-TIMESTEPS: , : ]
test_y = scaled_close[ train_size-TIMESTEPS: , : ]

# Creating a Training set with n time-steps and 1 output
x_train = []
y_train = []

for i in range(TIMESTEPS, len(train_data)):
    x_train.append(train_data[i-TIMESTEPS:i, :])
    y_train.append(train_y[i, 0])

# Convert to numpy array
x_train, y_train = np.array(x_train), np.array(y_train)

# Reshaping the input to LSTM format of (ROWS X TIMESTEPS X FEATURES)
x_train = np.reshape(x_train, (x_train.shape[0], TIMESTEPS, FEATURES))

# Creating a Testing set with n time-steps and 1 output
x_test = []
y_test = []

for i in range(TIMESTEPS, len(test_data)):
    x_test.append(test_data[i-TIMESTEPS:i, :])
    y_test.append(test_y[i, 0])
    
x_test, y_test = np.array(x_test), np.array(y_test)

x_test = np.reshape(x_test, (x_test.shape[0], TIMESTEPS, FEATURES))

# MODEL 1 DEFINITION AND TRAINING
model = Sequential([
    LSTM(150, return_sequences= True, input_shape= (TIMESTEPS, FEATURES)),
    LSTM(64, return_sequences= False),
    Dense(32),
    Dense(16),
    Dense(1)
])

model.compile(optimizer= 'adam', loss= 'mse')

model.summary()

# METHOD FOR ADDING THE PROGRESS BAR
from tqdm.auto import tqdm
from tensorflow.keras.callbacks import Callback

class TQDMCallback(Callback):
    def on_train_begin(self, logs=None):
        self.epochs = self.params['epochs']
        self.progress_bar = tqdm(total=self.epochs, desc="Training Progress", unit="epoch")

    def on_epoch_end(self, epoch, logs=None):
        self.progress_bar.update(1)
        self.progress_bar.set_postfix(loss=logs.get('loss'), accuracy=logs.get('accuracy'))

    def on_train_end(self, logs=None):
        self.progress_bar.close()

# Fitting the LSTM to the Training set
callbacks = [EarlyStopping(monitor= 'loss', patience= 10 , restore_best_weights= True)]
history = model.fit(x_train, y_train, epochs= 100, batch_size= 16 , callbacks= callbacks )

# The method to use if you want to add the progress bar
# history = model.fit(x_train, y_train, epochs= 100, batch_size= 16 , callbacks= [TQDMCallback()] )

# Saving the model weights and passsing to another model
saved_weights = model.get_weights()

# MODEL 2 DEFINITION AND TRAINING
model_learned = Sequential([
    LSTM(150, return_sequences= True, input_shape= (TIMESTEPS, FEATURES)),
    LSTM(64, return_sequences= False),
    Dense(32),
    Dense(16),
    Dense(1)
])

model_learned.set_weights(saved_weights)

model_learned.compile(optimizer= 'adam', loss= 'mse')

model.summary()

# Fitting the LSTM to the Training set
callbacks = [EarlyStopping(monitor= 'loss', patience= 10 , restore_best_weights= True)]
history2 = model_learned.fit(x_train, y_train, epochs= 100, batch_size= 16 , callbacks= callbacks )

# Plotting the loss of MODEL 1
plt.plot(history.history["loss"])
plt.legend(['Mean Squared Error','Mean Absolute Error'])
plt.title("Losses")
plt.xlabel("epochs")
plt.ylabel("loss")
model1_loss_path = os.path.join(os.path.dirname(__file__), f'{STOCK}_model1_loss.png')
plt.savefig(model1_loss_path, bbox_inches='tight', dpi=300)
plt.close()

# Plotting the loss of MODEL 2
plt.plot(history2.history["loss"])
plt.legend(['Mean Squared Error','Mean Absolute Error'])
plt.title("Losses")
plt.xlabel("epochs")
plt.ylabel("loss")
model2_loss_path = os.path.join(os.path.dirname(__file__), f'{STOCK}_model2_loss.png')
plt.savefig(model2_loss_path, bbox_inches='tight', dpi=300)
plt.close()

#inverse y_test scaling
predictions = model_learned.predict(x_test)

predictions = scaler.inverse_transform(np.concatenate([predictions, 
                                                       np.zeros((predictions.shape[0], FEATURES-1))], 
                                                       axis=1))[:, 0]

# Inverse scale the true values
y_test = scaler.inverse_transform(np.concatenate([y_test.reshape(-1, 1), 
                                                  np.zeros((y_test.shape[0], FEATURES-1))], 
                                                  axis=1))[:, 0]

RMSE = np.sqrt(np.mean(( y_test - predictions )**2)).round(2)
RMSE

test = close_predictions.iloc[train_size: , 0:1]
test['Predicted Close'] = predictions

plt.figure(figsize=(50, 15))
plt.title('Close Stock Price Prediction', fontsize=18)
plt.xlabel('Date', fontsize=10)
plt.ylabel('Close Price', fontsize=18)
plt.plot(df['Close'], linewidth=3)
plt.plot(test["Predicted Close"], linewidth=3)
plt.legend(['Test Close', 'Predicted Close'])
prediction_plot_path = os.path.join(os.path.dirname(__file__), f'{STOCK}_prediction_plot.png')
plt.savefig(prediction_plot_path, bbox_inches='tight', dpi=300)
plt.close()

print(f"Plots saved as:")
print(f"- Model 1 Loss: {model1_loss_path}")
print(f"- Model 2 Loss: {model2_loss_path}")
print(f"- Prediction Plot: {prediction_plot_path}")

# CALCULATING THE AVERAGE DIFFERENCE BETWEEN CLOSING PRICE
# AND PREDICTED CLOSING PRICE
averages = np.array([])

for i in range(test.shape[0]):
    row = test.iloc[i]
    avg = abs(row.iloc[0] - row.iloc[1])
    averages = np.append(averages, avg)

average_var = np.average(averages)

print("The average value that the price deviates by is: {average_var}"
      .format(average_var = average_var))

# Predict the price for the next day
def predict_next_day():
    # Getting the most recent TIMESTEPS days of data
    recent_data = scaled_data[-TIMESTEPS:, :]
    
    # Reshaping into the format (samples, timesteps, features)
    X_recent = recent_data.reshape(1, TIMESTEPS, FEATURES)
    
    # Prediction
    next_day_scaled = model_learned.predict(X_recent)
    
    # Inverse transform to get actual price
    inverse_pred = np.zeros((1, FEATURES))
    inverse_pred[0, 0] = next_day_scaled[0, 0]
    next_day_price = scaler.inverse_transform(inverse_pred)[0, 0]
    
    return next_day_price

next_day_price = predict_next_day()
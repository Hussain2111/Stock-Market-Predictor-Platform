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
from keras.optimizers import Adam, SGD

from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, accuracy_score

# Choose the number of features used the time steps for learning

FEATURES = 6
TIMESTEPS = 14
STOCK = 'SBUX'

start = '2017-01-01'
end = '2025-01-01'

# These are commented becaused already imported and saved for easy access
#
# df = yf.download('^VIX', 
#                  start = start,
#                  end = end,
#                  multi_level_index = False)

# df.to_csv('data/vix_dataset.csv')

# df = yf.download('DX-Y.NYB', 
#                  start = start,
#                  end = end,
#                  multi_level_index = False)

# df.to_csv('data/usdx_dataset.csv')

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

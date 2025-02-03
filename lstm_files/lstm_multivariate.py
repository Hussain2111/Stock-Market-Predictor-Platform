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


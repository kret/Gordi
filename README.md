# Flow
1. collect training set data
   * 3 circle centers + variation
2. collect net params (optional)
   * hidden layer count
   * hidden layer sizes
   * learning rate
   * momentum
   * bias on/off
   * (?) propagation function
   * (?) initial weights
3. Learning
   * train 1 step
   * classify all input points
   * return to draw on screen
4. Testing
   * add 1 point and get it classified

Allow resetting

…

`POST /simulation/`  
Send simulation params and initialize the neural network.
Input: training set, network params
Output: redirect to /step/1 (?)
State: remember training set, create network, 1st eval, draw

`GET /step/{number}`  
Trains the neural network 1 time with next point [chosen?]. Sends back the points after classification by current network.


var path = require('path');
var webpack = require('webpack');
var config = require('../App.json');

module.exports = {
    entry: './js/Sources/Index.tsx',
	devtool: 'inline-source-map',
    module: {
		rules: [
			{
			  test: /\.tsx?$/,
			  use: 'ts-loader',
			  exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.styl$/,
				loader: 'style-loader!css-loader!stylus-loader'
			},
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
		]
    },
    resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'js')
    },
	plugins: [
		new webpack.DefinePlugin({
			"process.env": { 
				NODE_ENV: JSON.stringify(config.AppInfo.DEV_ENV) 
			}
		})
	]
};
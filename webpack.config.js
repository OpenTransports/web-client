const webpack = require('webpack')
const path    = require('path')
const dotenv  = require('dotenv')
// Plugins
const CompressionPlugin  = require('compression-webpack-plugin')
const HtmlWebpackPlugin  = require('html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

// Default dev config
config = {
	context: path.resolve(__dirname, "src"),
	target : "web",
	entry  : "./containers/Root.tsx",
	output : {
		path    : path.resolve(__dirname, "dist"),
		filename: "app.js",
	},
	resolve: {
		extensions : [".js", ".ts", ".json", ".tsx", ".css", "less"],
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: "awesome-typescript-loader"    },
			{ test: /\.css/  , use   : ["style-loader", "css-loader"] },
			{ test: /\.png/  , loader: 'file-loader?name=[name].[ext]'},
		],
	},
	watch  : true,
	devtool: "inline-source-map",
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin(dotenv.config({sage:true}).parsed),
		new HtmlWebpackPlugin({ template : "index.html" }),
		new WebpackPwaManifest({
			name            : "OpenTransports-test",
			short_name      : "OpenTransports-test",
			description     : "Find nearest public transports",
			display         : "standalone",
			background_color: '#00bcd4',
		}),
	],
	devServer: {
		port: 9000,
		host: "0.0.0.0",
		hot : true,
		compress: true,
		disableHostCheck  : true,
		historyApiFallback: true,
		noInfo: true,
		https : true,
		proxy : {
		  '/api'  : 'http://localhost:8080',
		  '/media': 'http://localhost:8080',
		},
	},
}


// Tweak config for production
if (process.env.production) {
	console.log("PRODUCTION")
	config.output.path = path.resolve(__dirname, "dist")
	config.watch   = false
	config.devtool = "source-map"
	config.plugins = [
		new HtmlWebpackPlugin({ template : "index.html" }),
		new WebpackPwaManifest({
			name            : "OpenTransports",
			short_name      : "OpenTransports",
			description     : "Find nearest public transports",
			display         : "standalone",
			background_color: '#2962FF',
		}),
		new webpack.DefinePlugin({
			MOCK_POSITION: null,
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new CompressionPlugin({
			asset    : "[path].gz[query]",
			algorithm: "gzip",
			test     : /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio : 0.8
		}),
	]
	config.performance = {
		hints            : "warning",
		maxAssetSize     : 200000,
		maxEntrypointSize: 400000,
	}
	config.devServer = undefined
}


// Export final config
module.exports = config

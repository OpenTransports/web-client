const webpack = require('webpack')
const path    = require('path')
const dotenv  = require('dotenv')
// Plugins
const CompressionPlugin  = require('compression-webpack-plugin')
const HtmlWebpackPlugin  = require('html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const UglifyJsPlugin     = require('uglifyjs-webpack-plugin')
const webpackExternalModule = require("webpack-external-module")

// Default dev config
config = {
	context: path.resolve(__dirname, "src"),
	target : "web",
	entry  : "./containers/Root.tsx",
	output : {
		path    : path.resolve(__dirname, "dist"),
		filename: "[name].js",
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
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			filename: "[name]-bundle.js",
			minChunks: function(module) {
				return webpackExternalModule.isExternal(module, {
					smartDetection: false
				})
			}
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin(Object.assign(
			{
				MOCK_SERVERS : null,
				MOCK_POSITION: null,
			},
			dotenv.config().parsed,
		)),
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
		proxy : {
		  '/transports': 'http://localhost:8080',
		  '/agencies'  : 'http://localhost:8080',
		  '/medias'    : 'http://localhost:8080',
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
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			filename: "[name]-bundle.js",
			minChunks: function(module) {
				return webpackExternalModule.isExternal(module, {
					smartDetection: false
				})
			}
		}),
		new HtmlWebpackPlugin({ template : "index.html" }),
		new WebpackPwaManifest({
			name            : "OpenTransports",
			short_name      : "OpenTransports",
			description     : "Find nearest public transports",
			display         : "standalone",
			background_color: '#2962FF',
		}),
		new webpack.DefinePlugin({
			MOCK_SERVERS : null,
			MOCK_POSITION: null,
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
		new UglifyJsPlugin(),
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

const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackStringReplacePlugin = require('html-webpack-string-replace-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')


module.exports = function (env, argv) {
  const isProd = argv.mode === 'production'
  return {
    entry: [
      './src/index.js', 
      './src/styles.scss', 
      './src/manifest.json', 
      './src/sw.js'
    ],
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [{
        test: /(\.json)$/,
        type: 'javascript/auto',
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          }
        }]
      }, {
        test: /(sw\.js)$/,
        type: 'javascript/auto',
        use: [{
          loader: 'file-loader',
          options: {
            name: '../[name].[ext]',
          }
        }]
      }, {
        test: /\.scss$/,
        use: [{ 
          loader: MiniCssExtractPlugin.loader, 
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      }]
    },
    optimization: {
      minimize: isProd,
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()]
    },
    stats: {
			children: false,
			hash: false,
			modules: false
		},
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: '../index.html',
        minify: {
          collapseWhitespace: isProd,
          removeComments: isProd,
          removeRedundantAttributes: isProd,
          removeScriptTypeAttributes: isProd,
          removeStyleLinkTypeAttributes: isProd,
          useShortDoctype: isProd
        }
      }),
      new HtmlWebpackStringReplacePlugin({
        'APPLE_IMG': 'data:image/png;base64,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',
        'FAVICON_IMG': 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbwvwAG8L8ABvC/AIbwvwIG8L8DBvC/AwbwvwIG8L8AhvC/AAbwvwAAAAAAAAAAAAAAAAAG8L8ABvC/AEbwvwbG8L8ThvC/H8bwvyiG8L8txvC/MAbwvzAG8L8txvC/KIbwvx/G8L8ThvC/BsbwvwBG8L8ABvC/Bkbwvx9G8L81xvC/Pkbwvz/G8P8/xvD/P8bw/z/G8P8/xvD/P8bw/z/G8L8/xvC/PkbwvzXG8L8fRvC/Bkbwvy2G8L8/RvC/P8bwvz/G8P8/x25+v8iovf/J5X0/yeV9P8iovf/Hbn6/xvD/P8bwvz/G8L8/xvC/P0bwvy2G8L8/RvC/P8bwvz/G8P9/yCt+f8qefD/X43x/7HG+P+xxvj/X43x/yp58P8grfn/G8P9/xvC/P8bwvz/G8L8/RvC/Pobwvz/G8P9/xy68P8kleD/KIPp/0y0+v983v7/fN7+/0y0+v8og+n/JJXg/xy68P8bw/3/G8L8/xvC/PobwvzoG8P9/yCcx/8nbIP/JnGM/yZwi/8encj/F8L9/xfC/f8encj/JnCL/yZxjP8nbIP/IJzH/xvD/f8bwvzoG8P9xxy68P8mb4n/HqnZ/yCfy/8mb4n/KV5x/x6r3P8eq9z/KV9x/yZwif8gn8v/HqnZ/yZvif8cuvD/G8P9xxvE/5Ierd//JHyb/xvA+f8pXnD/LjU3/ydqgf8lfJv/JXyb/ydqgf8uNTf/KV1w/xvA+f8kfJv/Hq3f/xvE/5Iayv9LI4qu8SdmfP8dtuv/JXeT/ytLVf8mc4//LUBG/y1ARv8mc47/K0pV/yV3k/8dtuv/J2Z8/yOKrvEayv9LGNv/ECKRuLsnbIX/JXaS/yV3lP8mcoz/JXqX/yOEpf8jhKX/JXqX/yZyjP8leJT/JXaS/ydshf8ikbi7GNr/EBvE/gAbxP5QG8H78hy99P8cu/P/G7/4/xvD/f8bxP//G8T//xvD/f8bv/j/HLvz/xy99P8bwfvyG8T+UBvE/gAbwvwAG8L8BRvC/IMbwvz5G8L8/xvC/P8bwvz/G8L8/xvC/P8bwvz/G8L8/xvC/P8bwvz5G8L8gxvC/AUbwvwAAAAAABvC/AAbwvwKG8L8dBvC/OMbwvz/G8L8/xvC/P8bwvz/G8L8/xvC/P8bwvzjG8L8dBvC/AobwvwAAAAAAAAAAAAAAAAAG8L8ABvC/AIbwvwrG8L8dRvC/Kkbwvy+G8L8vhvC/Kkbwvx1G8L8LBvC/AIbwvwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG8L8ABvC/AAbwvwEG8L8CxvC/AsbwvwEG8L8ABvC/AAAAAAAAAAAAAAAAAAAAAAA+B8AAIABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAAgAEAAMADAADgBwAA/D8AAA==',
        'NERD_BLOB_IMG': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTI4IDEyODsiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxwYXRoIGQ9Ik02NCw5LjQ3Yy02Mi41MiwwLTY0LDcwLjA4LTY0LDgzLjk1YzAsMTMuODgsMjguNjUsMjUuMTEsNjQsMjUuMTFzNjMuOTktMTEuMjMsNjMuOTktMjUuMTEgQzEyNy45OSw3OS41NSwxMjYuNTIsOS40Nyw2NCw5LjQ3eiIgc3R5bGU9ImZpbGw6I0ZDQzIxQjsiLz4KICA8cGF0aCBkPSJNNjQuMTQsMTQ0LjZjLTE3LjQ0LDAtMjUuMDUtMTEuMS0yNS4zOC0xMS41NGMtMS4wNS0xLjM5LTAuNzctMy4zOCwwLjYyLTQuNDMgYzEuMzktMS4wNSwzLjM2LTAuNzcsNC40MSwwLjYxYzAuMywwLjM4LDYuMTksOS4wNCwyMC41Niw5LjA0YzEzLjI0LDAsMTkuNDYtOC4zNSwxOS43Mi04LjczYzAuOTktMS40MywyLjk1LTEuOCw0LjM5LTAuODIgYzEuNDQsMC45OCwxLjgxLDIuOTIsMC44NSw0LjM3Qzg4Ljk4LDEzMy42LDgxLjI4LDE0NC42LDY0LjE0LDE0NC42eiIgc3R5bGU9ImZpbGw6IzJGMkYyRjsiLz4KICA8cGF0aCBkPSJNMTE1LjY5LDUwLjY4Yy0wLjAzLTAuNzgtMC4xMS00LjA3LTAuMjQtNC44NSBjLTAuMy0xLjc2LTAuNDgtMS44NC0yLjI1LTIuMTVjLTI4LjQ1LTUuMDItMzMuNTIsMS4wNi00OS4yLDEuMzloMGgwYy0xNS42OC0wLjMyLTIwLjc2LTYuNDEtNDkuMi0xLjM5IGMtMS43NywwLjMyLTEuOTUsMC4zOS0yLjI1LDIuMTVjLTAuMTIsMC43OC0wLjIxLDQuMDgtMC4yNCw0Ljg1Yy0wLjA2LDEuNDQsMC4yMywxLjYzLDEuNjYsMi40YzEuMjUsMC42NiwxLjgzLDAuODYsMS44MywzLjQ5IGMwLDE3LjM1LDcuODgsMjIuNzEsMTguNDYsMjMuMTNjMTEuMTksMC40NCwyMC4yOS01LjkzLDI0LjA4LTE1LjY5YzIuNjEtNi43Myw0LjE1LTEwLjE2LDUuNjctMTAuMzMgYzEuNTEsMC4xNywzLjA1LDMuNjEsNS42NywxMC4zM2MzLjc5LDkuNzcsMTIuODksMTYuMTMsMjQuMDgsMTUuNjljMTAuNTktMC40MiwxOC40Ni01Ljc4LDE4LjQ2LTIzLjEzYzAtMi42MywwLjU4LTIuODMsMS44My0zLjQ5IEMxMTUuNDYsNTIuMzEsMTE1Ljc1LDUyLjEyLDExNS42OSw1MC42OHogTTU1LjAzLDU1LjczQzUyLjE5LDY0LDQ4Ljc4LDc0LjgxLDM0LjQsNzQuMjdjLTEwLjYzLTAuMzktMTMuNzItNy45OC0xMy45NC0xOC4wNSBjLTAuMTUtNi41MywwLjc4LTguMDQsNC45Mi04Ljg5YzMuODgtMC44LDcuODYtMS4xOCwxMS43OC0xLjAzYzQuNzIsMC4xOSwxMC4xMiwxLjIxLDEzLjc0LDIuODIgQzU1LjUzLDUxLjIsNTYuMDQsNTIuODEsNTUuMDMsNTUuNzN6IE0xMDcuNTMsNTYuMjNjLTAuMjIsMTAuMDYtMy4zMSwxNy42Ni0xMy45NCwxOC4wNUM3OS4yMiw3NC44MSw3NS44MSw2NCw3Mi45Nyw1NS43MyBjLTEuMDEtMi45Mi0wLjUtNC41NCw0LjEzLTYuNjFjMy42Mi0xLjYxLDkuMDItMi42NCwxMy43NC0yLjgyYzMuOTItMC4xNSw3LjksMC4yMywxMS43OCwxLjAzIEMxMDYuNzYsNDguMTgsMTA3LjY4LDQ5LjcsMTA3LjUzLDU2LjIzeiIgc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6IzJGMkYyRjsiLz4KICA8Zz4KICAgIDxwYXRoIGQ9Ik05MS43Niw4My45NmMtMy45Ni00LjAzLTEyLjQsMS4wNy0yNy43NiwxLjA3cy0yMy44LTUuMS0yNy43Ni0xLjA3Yy0wLjk4LDEtMS4zOCwzLjM1LTAuMzUsNC45MyBjMi44Miw0LjMyLDEzLjMxLDExLjQ1LDI4LjEsMTEuN2MxNC43OS0wLjI0LDI1LjI5LTcuMzgsMjguMS0xMS43QzkzLjE0LDg3LjMxLDkyLjc0LDg0Ljk2LDkxLjc2LDgzLjk2eiIgc3R5bGU9ImZpbGw6I0VENkMzMDsiLz4KICAgIDxnPgogICAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBpZD0iU1ZHSURfMV8iIGQ9Ik05MS43Niw4My45NmMtMy45Ni00LjAzLTEyLjQsMS4wNy0yNy43NiwxLjA3cy0yMy44LTUuMS0yNy43Ni0xLjA3Yy0wLjk4LDEtMS4zOCwzLjM1LTAuMzUsNC45MyBjMi44Miw0LjMyLDEzLjMxLDExLjQ1LDI4LjEsMTEuN2MxNC43OS0wLjI0LDI1LjI5LTcuMzgsMjguMS0xMS43QzkzLjE0LDg3LjMxLDkyLjc0LDg0Ljk2LDkxLjc2LDgzLjk2eiIvPgogICAgICA8L2RlZnM+CiAgICAgIDxjbGlwUGF0aCBpZD0iU1ZHSURfMl8iPgogICAgICAgIDx1c2Ugc3R5bGU9Im92ZXJmbG93OnZpc2libGU7IiB4bGluazpocmVmPSIjU1ZHSURfMV8iLz4KICAgICAgPC9jbGlwUGF0aD4KICAgICAgPGcgc3R5bGU9ImNsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTsiPgogICAgICAgIDxwYXRoIGQ9Ik01Mi45Myw4My45MXY1LjVjMCwxLjg3LDEuMzcsMy40NSwzLjIyLDMuNzFsMy41OCwwLjUxQzYxLjk4LDkzLjk1LDY0LDkyLjIsNjQsODkuOTJ2LTYuMDEgQzY0LDgzLjkxLDU3LjA2LDg0LjU3LDUyLjkzLDgzLjkxeiIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiLz4KICAgICAgICA8cGF0aCBkPSJNNzUuMDcsODMuOTF2NS41YzAsMS44Ny0xLjM3LDMuNDUtMy4yMiwzLjcxbC0zLjU4LDAuNTFDNjYuMDIsOTMuOTUsNjQsOTIuMiw2NCw4OS45MnYtNi4wMSBDNjQsODMuOTEsNzAuOTQsODQuNTcsNzUuMDcsODMuOTF6IiBzdHlsZT0iZmlsbDojRkZGRkZGOyIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgogIDxnPgogICAgPHBhdGggZD0iTTQyLDY4Yy00LjQ5LDAuMDQtOC4xNy00LjI3LTguMjItOS42MmMtMC4wNS01LjM3LDMuNTUtOS43NSw4LjA0LTkuNzkgYzQuNDgtMC4wNCw4LjE3LDQuMjcsOC4yMiw5LjY0QzUwLjA5LDYzLjU5LDQ2LjQ5LDY3Ljk2LDQyLDY4eiIgc3R5bGU9ImZpbGw6IzJGMkYyRjsiLz4KICAgIDxwYXRoIGQ9Ik04Ni4xMSw2OGM0LjQ4LTAuMDEsOC4xMS00LjM2LDguMS05LjcxYy0wLjAxLTUuMzctMy42Ni05LjctOC4xNC05LjY5IGMtNC40OSwwLjAxLTguMTMsNC4zNi04LjEyLDkuNzNDNzcuOTcsNjMuNjgsODEuNjIsNjguMDEsODYuMTEsNjh6IiBzdHlsZT0iZmlsbDojMkYyRjJGOyIvPgogIDwvZz4KPC9zdmc+',
        'CODEPEN_IMG': 'data:image/png;base64,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',
        'GITHUB_IMG': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQzOC41NDlweCIgaGVpZ2h0PSI0MzguNTQ5cHgiIHZpZXdCb3g9IjAgMCA0MzguNTQ5IDQzOC41NDkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQzOC41NDkgNDM4LjU0OTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTQwOS4xMzIsMTE0LjU3M2MtMTkuNjA4LTMzLjU5Ni00Ni4yMDUtNjAuMTk0LTc5Ljc5OC03OS44QzI5NS43MzYsMTUuMTY2LDI1OS4wNTcsNS4zNjUsMjE5LjI3MSw1LjM2NQ0KCQljLTM5Ljc4MSwwLTc2LjQ3Miw5LjgwNC0xMTAuMDYzLDI5LjQwOGMtMzMuNTk2LDE5LjYwNS02MC4xOTIsNDYuMjA0LTc5LjgsNzkuOEM5LjgwMywxNDguMTY4LDAsMTg0Ljg1NCwwLDIyNC42Mw0KCQljMCw0Ny43OCwxMy45NCw5MC43NDUsNDEuODI3LDEyOC45MDZjMjcuODg0LDM4LjE2NCw2My45MDYsNjQuNTcyLDEwOC4wNjMsNzkuMjI3YzUuMTQsMC45NTQsOC45NDUsMC4yODMsMTEuNDE5LTEuOTk2DQoJCWMyLjQ3NS0yLjI4MiwzLjcxMS01LjE0LDMuNzExLTguNTYyYzAtMC41NzEtMC4wNDktNS43MDgtMC4xNDQtMTUuNDE3Yy0wLjA5OC05LjcwOS0wLjE0NC0xOC4xNzktMC4xNDQtMjUuNDA2bC02LjU2NywxLjEzNg0KCQljLTQuMTg3LDAuNzY3LTkuNDY5LDEuMDkyLTE1Ljg0NiwxYy02LjM3NC0wLjA4OS0xMi45OTEtMC43NTctMTkuODQyLTEuOTk5Yy02Ljg1NC0xLjIzMS0xMy4yMjktNC4wODYtMTkuMTMtOC41NTkNCgkJYy01Ljg5OC00LjQ3My0xMC4wODUtMTAuMzI4LTEyLjU2LTE3LjU1NmwtMi44NTUtNi41N2MtMS45MDMtNC4zNzQtNC44OTktOS4yMzMtOC45OTItMTQuNTU5DQoJCWMtNC4wOTMtNS4zMzEtOC4yMzItOC45NDUtMTIuNDE5LTEwLjg0OGwtMS45OTktMS40MzFjLTEuMzMyLTAuOTUxLTIuNTY4LTIuMDk4LTMuNzExLTMuNDI5Yy0xLjE0Mi0xLjMzMS0xLjk5Ny0yLjY2My0yLjU2OC0zLjk5Nw0KCQljLTAuNTcyLTEuMzM1LTAuMDk4LTIuNDMsMS40MjctMy4yODljMS41MjUtMC44NTksNC4yODEtMS4yNzYsOC4yOC0xLjI3Nmw1LjcwOCwwLjg1M2MzLjgwNywwLjc2Myw4LjUxNiwzLjA0MiwxNC4xMzMsNi44NTENCgkJYzUuNjE0LDMuODA2LDEwLjIyOSw4Ljc1NCwxMy44NDYsMTQuODQyYzQuMzgsNy44MDYsOS42NTcsMTMuNzU0LDE1Ljg0NiwxNy44NDdjNi4xODQsNC4wOTMsMTIuNDE5LDYuMTM2LDE4LjY5OSw2LjEzNg0KCQljNi4yOCwwLDExLjcwNC0wLjQ3NiwxNi4yNzQtMS40MjNjNC41NjUtMC45NTIsOC44NDgtMi4zODMsMTIuODQ3LTQuMjg1YzEuNzEzLTEyLjc1OCw2LjM3Ny0yMi41NTksMTMuOTg4LTI5LjQxDQoJCWMtMTAuODQ4LTEuMTQtMjAuNjAxLTIuODU3LTI5LjI2NC01LjE0Yy04LjY1OC0yLjI4Ni0xNy42MDUtNS45OTYtMjYuODM1LTExLjE0Yy05LjIzNS01LjEzNy0xNi44OTYtMTEuNTE2LTIyLjk4NS0xOS4xMjYNCgkJYy02LjA5LTcuNjE0LTExLjA4OC0xNy42MS0xNC45ODctMjkuOTc5Yy0zLjkwMS0xMi4zNzQtNS44NTItMjYuNjQ4LTUuODUyLTQyLjgyNmMwLTIzLjAzNSw3LjUyLTQyLjYzNywyMi41NTctNTguODE3DQoJCWMtNy4wNDQtMTcuMzE4LTYuMzc5LTM2LjczMiwxLjk5Ny01OC4yNGM1LjUyLTEuNzE1LDEzLjcwNi0wLjQyOCwyNC41NTQsMy44NTNjMTAuODUsNC4yODMsMTguNzk0LDcuOTUyLDIzLjg0LDEwLjk5NA0KCQljNS4wNDYsMy4wNDEsOS4wODksNS42MTgsMTIuMTM1LDcuNzA4YzE3LjcwNS00Ljk0NywzNS45NzYtNy40MjEsNTQuODE4LTcuNDIxczM3LjExNywyLjQ3NCw1NC44MjMsNy40MjFsMTAuODQ5LTYuODQ5DQoJCWM3LjQxOS00LjU3LDE2LjE4LTguNzU4LDI2LjI2Mi0xMi41NjVjMTAuMDg4LTMuODA1LDE3LjgwMi00Ljg1MywyMy4xMzQtMy4xMzhjOC41NjIsMjEuNTA5LDkuMzI1LDQwLjkyMiwyLjI3OSw1OC4yNA0KCQljMTUuMDM2LDE2LjE4LDIyLjU1OSwzNS43ODcsMjIuNTU5LDU4LjgxN2MwLDE2LjE3OC0xLjk1OCwzMC40OTctNS44NTMsNDIuOTY2Yy0zLjksMTIuNDcxLTguOTQxLDIyLjQ1Ny0xNS4xMjUsMjkuOTc5DQoJCWMtNi4xOTEsNy41MjEtMTMuOTAxLDEzLjg1LTIzLjEzMSwxOC45ODZjLTkuMjMyLDUuMTQtMTguMTgyLDguODUtMjYuODQsMTEuMTM2Yy04LjY2MiwyLjI4Ni0xOC40MTUsNC4wMDQtMjkuMjYzLDUuMTQ2DQoJCWM5Ljg5NCw4LjU2MiwxNC44NDIsMjIuMDc3LDE0Ljg0Miw0MC41Mzl2NjAuMjM3YzAsMy40MjIsMS4xOSw2LjI3OSwzLjU3Miw4LjU2MmMyLjM3OSwyLjI3OSw2LjEzNiwyLjk1LDExLjI3NiwxLjk5NQ0KCQljNDQuMTYzLTE0LjY1Myw4MC4xODUtNDEuMDYyLDEwOC4wNjgtNzkuMjI2YzI3Ljg4LTM4LjE2MSw0MS44MjUtODEuMTI2LDQxLjgyNS0xMjguOTA2DQoJCUM0MzguNTM2LDE4NC44NTEsNDI4LjcyOCwxNDguMTY4LDQwOS4xMzIsMTE0LjU3M3oiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K',
        'LINKEDIN_IMG': 'data:image/png;base64,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'
      })
    ]
  }
};
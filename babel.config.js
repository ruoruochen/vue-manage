// 项目发布阶段用到的babel插件
// const prodPlugins = []
// if (process.env.NOME_ENV === 'production') {
//   prodPlugins.push("transform-remove-console")
// }

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    //发布产品时候的插件数组
    // ...prodPlugins,
    "transform-remove-console",
    "@babel/plugin-syntax-dynamic-import"
  ]
}
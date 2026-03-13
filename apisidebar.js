module.exports = {
  apiSidebar: [
    {
      type: "doc",
      id: "introduction",
      label: "Introduction",
    },
    {
      type: "category",
      label: "ANSCER API",
      link: {
        type: "generated-index",
        title: "ANSCER API",
      },
      collapsed: false,
      items: (() => {
        try {
          return require("./api/ansceranya/v1/sidebar.js");
        } catch (error) {
          return [];
        }
      })(),
    },
  ],
};

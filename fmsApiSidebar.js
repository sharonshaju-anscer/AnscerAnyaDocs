module.exports = {
  fmsApiSidebar: [
    {
      type: "doc",
      id: "introduction",
      label: "Introduction",
    },
    {
      type: "category",
      label: "ANSCER FMS REST API",
      link: {
        type: "generated-index",
        title: "ANSCER FMS REST API",
      },
      collapsed: false,
      items: (() => {
        try {
          return require("./api/ansceranyafms/v1/sidebar.js");
        } catch (error) {
          return [];
        }
      })(),
    },
  ],
};

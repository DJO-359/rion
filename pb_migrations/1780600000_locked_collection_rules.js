/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const orders = app.findCollectionByNameOrId("pbc_3527180448");
  unmarshal(
    {
      createRule: "name != '' && phone != '' && product != ''",
      deleteRule: null,
      listRule: null,
      updateRule: null,
      viewRule: null,
    },
    orders,
  );
  app.save(orders);

  const products = app.findCollectionByNameOrId("pbc_4092854851");
  unmarshal(
    {
      createRule: null,
      deleteRule: null,
      listRule: "active = true",
      updateRule: null,
      viewRule: "active = true",
    },
    products,
  );
  app.save(products);
}, (app) => {
  const orders = app.findCollectionByNameOrId("pbc_3527180448");
  unmarshal(
    {
      createRule: "",
      deleteRule: "",
      listRule: "",
      updateRule: "",
      viewRule: "",
    },
    orders,
  );
  app.save(orders);

  const products = app.findCollectionByNameOrId("pbc_4092854851");
  unmarshal(
    {
      createRule: "",
      deleteRule: "",
      listRule: "active = true",
      updateRule: "",
      viewRule: "active = true",
    },
    products,
  );
  app.save(products);
});

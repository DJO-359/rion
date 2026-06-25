/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const orders = app.findCollectionByNameOrId("pbc_3527180448");
  unmarshal(
    {
      createRule: "name != '' && phone != '' && product != ''",
    },
    orders,
  );
  app.save(orders);
}, (app) => {
  const orders = app.findCollectionByNameOrId("pbc_3527180448");
  unmarshal({ createRule: null }, orders);
  app.save(orders);
});

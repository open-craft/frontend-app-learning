
console.log({ PLUGINS });

//const data = await import("@open-craft/frontend-slot-plugin-test");
//console.log({data})

const config = {
  pluginSlots: {}
};

PLUGINS.forEach(async ({
  scope,
  name
}) => {
  const plugin = name.replace(/^frontend-slot-/, '');
  console.log({
    scope,
    name
  });
  try {
    if (scope) {

      const data = await import(
        /* webpackChunkName: "plugin-slots" */
        /* webpackMode: "eager" */
        /* webpackInclude: /frontend-slot-/ */
        /* webpackExports: ["default", "named"] */
      scope + '/frontend-slot-' + plugin + '/dist/index.js'
        );
      data.slotConfig && Object.assign(config.pluginSlots, data.slotConfig);
    } else {
      const data = await import('frontend-slot-' + plugin + '/plugin-slots');
      console.log({ data });
    }
  } catch (e) {
    console.log({ e });
  }
});


export default config;

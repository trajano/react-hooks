const td = require("typedoc");

/** @param {td.Application} app */
exports.load = function (app) {
  app.converter.on(
    td.Converter.EVENT_RESOLVE_BEGIN,
    /** @param {td.Context} context */ (context) => {
      const toMove = [];
      for (const mod of context.project.children) {
        if (mod.children.length === 1 && !mod.hasComment()) {
          toMove.push(mod.children[0]);
        }
      }

      for (const child of toMove) {
        child.parent.children = undefined;
        context.project.removeReflection(child.parent);
        context.project.children.push(child);
        child.parent = context.project;
      }
    }
  );
};

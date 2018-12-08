
/**
 * Generate colModel for jqGrid.
 * @author Liulinwj
 * @license MIT
 */

var buildColumn = (function() {

  let defaultColumn = {
    title    : true,
    resizable: true,
    sortable : true,
    align    : "center",
  };

  return function(label, name) {
    return new Proxy({
      label,
      name,
      title    : false,
      resizable: false,
      sortable : false,
    }, {
      get(target, k, proxy) {
        if (k === "build") {
          return () => target;
        }
        if (k === "remove") {
          return col => {
            Reflect.deleteProperty(target, col);
            return proxy;
          };
        }
        return (v = defaultColumn[k]) => {
          target[k] = v;
          return proxy;
        };
      },
    });
  };

})();

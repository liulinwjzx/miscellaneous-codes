/**
 * @author Liulinwj
 * @license MIT
 */

function aop(original, inject, {
  before  = true,
  pipe    = before ? Boolean : Boolean.bind(null, true),
  promise = false,
  errorHandler,
} = {}) {

  if (!original || !inject) {
    return original || inject;
  }

  let [f1, f2] = before ? [inject, original] : [original, inject];

  if (promise) {
    return function() {
      Promise.resolve(Reflect.apply(f1, this, arguments))
        .then(m => {
          pipe(m) && Reflect.apply(f2, this, arguments);
        })
        .catch(e => {
          if (errorHandler) {
            errorHandler(e);
          } else {
            throw e;
          }
        });
    };
  }

  return function() {
    if (pipe(Reflect.apply(f1, this, arguments))) {
      Reflect.apply(f2, this, arguments);
    }
  };

}

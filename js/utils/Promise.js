export default function (api){
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, options, { success: resolve, fail: reject }), ...params);
    });
  }
}
 
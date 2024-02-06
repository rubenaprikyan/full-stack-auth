import { useEffect } from 'react';

/**
 * Custom hook to call as unMount
 * @usage
 *    function component() {
 *      useMount(() => {
 *        console.log("test")
 *      })
 *      return <></>
 *    }
 * @param {Function} cb - your callback function
 */
function useUnmount(cb: Function): void {
  useEffect(() => {
    return cb();
  }, [cb]);
}

export default useUnmount;

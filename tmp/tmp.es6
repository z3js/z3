/**
 * @file {template}
 */

/* global __inline */
export const {template} = {
    template: __inline( './{template}.jade' ),

    /**
     *  每次进入均会执行
     *
     *          若想操作 this，您可通过 $vm 操作
     *          原因请看文档
     *
     *  Documentation: https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
     */
    beforeRouteEnter: ( to, from, next ) => next( $vm => {

    } ),

    // 只执行一次
    // Documentation: https://cn.vuejs.org/v2/api/#mounted
    mounted() {
    }
};

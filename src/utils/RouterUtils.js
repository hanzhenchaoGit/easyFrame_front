export function getRouters(routers) {
  const menus = []
  for (const i in routers) {
    let routerRes = {}
    if (routers[i].mtype === 'button') {
      return
    }
    if (routers[i].children.length > 0) {
      routerRes = {
        path: routers[i].path,
        name: routers[i].name,
        component: () => import('@/views/' + routers[i].component + '.vue'),
        meta: {
          title: routers[i].label,
          icon: routers[i].icon
        },
        children: getRouters(routers[i].children)
      }
    } else {
      routerRes = {
        path: routers[i].path,
        name: routers[i].name,
        hidden: routers[i].isshow === 'N',
        component: () => import('@/views/' + routers[i].component + '.vue'),
        meta: {
          title: routers[i].label,
          icon: routers[i].icon
        }
      }
    }
    menus.push(routerRes)
  }
  return menus
}


export function checkWalls(player:any, cW:number, cH:number, keys:any) {
    if ((player.y + player.h) > cH) {
        keys.s = false
    }
    if ((player.x + player.w) > cW) {
        keys.d = false
    }
    if (player.x < 0) {
        keys.a = false
    }
    if (player.y < 0) {
        keys.w = false
    }
}

export type Vector2 = {
    x: number,
    y: number
  };
  
  export type Circle = Vector2 & {
    radius: number
  };
  
  export type CircleBody = Circle & {
   // vx: number,
   // vy: number
  };
  
  export function distance(a: Vector2, b: Vector2): number {
    return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
  }
  
  export function circleOverlap(a: Circle, b: Circle): boolean {
    return (a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y) <= (a.radius + b.radius)*(a.radius + b.radius);
  }
  
  export function handleCircleCollision(a: CircleBody, b: CircleBody): void {
    if(!circleOverlap(a, b))
      return;
  
    let d = distance(a, b);
    const overlap = (d - a.radius - b.radius) * 0.5;
  
    a.x -= overlap * (a.x - b.x) / d;
    a.y -= overlap * (a.y - b.y) / d;
  
    b.x += overlap * (a.x - b.x) / d;
    b.y += overlap * (a.y - b.y) / d;
  
    d = distance(a, b);
  
    const xNormal = (b.x - a.x) / d;
    const yNormal = (b.y - a.y) / d;
    const xTangent = -yNormal;
    const yTangent = xNormal;
  }
import { trigger, style, animate, transition } from '@angular/animations';

export const animations = [
  trigger(
    'inOutAnimation',
    [
      transition(
        ':enter',
        [
          //style({ height: 0, opacity: 0 }),
          animate('500ms ease-out',
          style({ height: 300, opacity: 1 }))
        ]
      ),
      transition(
        ':leave',
        [
          //style({ height: 300, opacity: 1 }),
          animate('500ms ease-in',
          style({ height: 0, opacity: 0 }))
        ]
      )
    ]
  )
]

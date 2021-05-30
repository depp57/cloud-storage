import { animate, query, style, transition, trigger } from '@angular/animations';

export const slideInOutAnimation = [
  trigger('inOutRightAnimation', [

    transition(':enter', [
      query('.folder-container', style({
        opacity: 0,
        transform: 'translate3d(50%, 0, 0)'
      })),
      query('.folder-container',
        animate('300ms cubic-bezier(.1, .9, .2, 1)', style({
          opacity: 1,
          transform: 'translate3d(0, 0, 0)'
        }))
      )
    ]),

    transition(':leave', [
      query('.folder-container', style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      })),
      query('.folder-container',
        animate('260ms cubic-bezier(.1, .9, .2, 1)', style({
          opacity: 0,
          transform: 'translate3d(50%, 0, 0)'
        }))
      )
    ])
  ])
];

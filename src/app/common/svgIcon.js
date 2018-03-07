var icons = {
  deployments: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"> <path fill="#F1F6F7" fill-rule="evenodd" d="M1.85 10.458c-1.481-.74-1.437-1.84.098-2.453l17.299-6.92c1.535-.614 2.282.134 1.668 1.669l-6.92 17.298c-.614 1.536-1.71 1.585-2.453.099l-1.89-3.78c-.74-1.482-2.536-3.28-4.022-4.023l-3.78-1.89z"/> </svg>',
  gateways: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"> <g fill="#F1F6F7" fill-rule="evenodd"> <rect width="8" height="6" x="6" rx="1"/><rect width="8" height="6" x="1" y="14" rx="1"/><rect width="8" height="6" x="11" y="14" rx="1"/><path d="M0 9h20v2H0zM14 11h2v3h-2zM9 6h2v3H9zM4 11h2v3H4z"/> </g></svg>',
  workflows: '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="14" viewBox="0 0 21 14"><path fill="none" fill-rule="evenodd" stroke="#F1F6F7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 7.47l1.454-.885C3.4 6.01 4.64 4.783 5.22 3.853L6.803 1.32c.293-.469.636-.416.768.128l2.691 11.046c.131.54.4.57.607.044l2.428-6.134A1.02 1.02 0 0 1 14.6 5.82l.355.132c1.037.388 2.744.925 3.812 1.2L20 7.47"/></svg>',
  blueprints: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20"><g fill="#F1F6F7" fill-rule="evenodd" transform="scale(1 -1) rotate(45 34.678 3.222)"><circle cx="11.5" cy="15.5" r="2.5"/><circle cx="3" cy="16" r="3"/><circle cx="11.5" cy="2.5" r="2.5"/><circle cx="2.5" cy="6.5" r="2.5"/><path fill-rule="nonzero" d="M3 13.401a8.843 8.843 0 0 1 1.949-2.585c3.395-3.108 8.821-3.347 12.65-.876l-.2-.872a.823.823 0 0 1 .14-.666.976.976 0 0 1 .614-.382c.252-.05.516-.006.733.122a.89.89 0 0 1 .422.56l.674 2.965c.103.48-.238.945-.762 1.04l-3.247.615c-.34.064-.69-.042-.921-.278a.83.83 0 0 1-.197-.868.945.945 0 0 1 .724-.59l.955-.181c-3.07-2.025-7.467-1.86-10.211.668C5.71 12.634 4.83 14 4.83 14s-1.873-.599-1.83-.599z"/></g></svg>',
  breeds: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="19" height="19" viewBox="0 0 19 19"><defs><path id="a" d="M0 0h20v20H0z"/></defs><g fill="none" fill-rule="evenodd"><mask id="b" fill="#fff"><use xlink:href="#a"/></mask><circle cx="2.5" cy="9.5" r="2.5" fill="#F1F6F7" mask="url(#b)"/><circle cx="9.5" cy="16.5" r="2.5" fill="#F1F6F7" mask="url(#b)"/><circle cx="16.5" cy="2.5" r="2.5" fill="#F1F6F7" mask="url(#b)"/><circle cx="16.5" cy="9.5" r="2.5" fill="#F1F6F7" mask="url(#b)"/><circle cx="9.5" cy="2.5" r="2.5" fill="#F1F6F7" mask="url(#b)"/><circle cx="2.5" cy="16.5" r="2.5" fill="#F1F6F7" mask="url(#b)"/><circle cx="9.5" cy="9.5" r="2.5" fill="#F1F6F7" mask="url(#b)"/></g></svg>',
  scales: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><g fill="#F1F6F7" fill-rule="evenodd"><rect width="15" height="15" x="5" rx="1"/><path d="M3 10H.995c-.54 0-.995.446-.995.995v8.01c0 .54.446.995.995.995h8.01c.54 0 .995-.446.995-.995V17H4c-.552 0-1-.445-1-1v-6z"/></g></svg>',
  conditions: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><g fill="#F1F6F7" fill-rule="evenodd"><rect width="20" height="4" rx="1"/><rect width="10" height="2" x="5" y="15" rx="1"/><rect width="14" height="3" x="3" y="8" rx="1"/></g></svg>',
  admin: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="#F1F6F7" fill-rule="evenodd" d="M17.372 8.077h1.943c.378 0 .685.306.685.685v2.476a.685.685 0 0 1-.685.685h-1.943c-1.007 0-1.512 1.218-.8 1.93l1.375 1.374a.684.684 0 0 1 0 .968l-1.752 1.752a.684.684 0 0 1-.968 0l-1.374-1.374c-.712-.713-1.93-.208-1.93.8v1.942a.685.685 0 0 1-.685.685H8.762a.685.685 0 0 1-.685-.685v-1.943c0-1.007-1.218-1.512-1.93-.8l-1.374 1.375a.684.684 0 0 1-.968 0l-1.752-1.752a.684.684 0 0 1 0-.968l1.374-1.374c.713-.712.208-1.93-.8-1.93H.686A.685.685 0 0 1 0 11.238V8.762c0-.379.307-.685.685-.685h1.943c1.007 0 1.512-1.218.8-1.93L2.052 4.773a.685.685 0 0 1 0-.969l1.752-1.75a.684.684 0 0 1 .968 0l1.374 1.373c.712.712 1.93.208 1.93-.8V.686c0-.378.306-.685.685-.685h2.476c.379 0 .685.307.685.685v1.943c0 1.007 1.218 1.511 1.93.799l1.374-1.374a.684.684 0 0 1 .968 0l1.752 1.751a.685.685 0 0 1 0 .97l-1.374 1.373c-.713.712-.208 1.93.8 1.93zm-4.218 2a3.077 3.077 0 1 0-6.154 0 3.077 3.077 0 0 0 6.154 0z"/></svg>',
  nav_collapse: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 24 24" enable-background="new 0 0 24 24" width="20" height="20"><g><path d="M24,3c0-0.6-0.4-1-1-1H1C0.4,2,0,2.4,0,3v2c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1V3z" fill="#FFFFFF"/><path d="M24,11c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1V11z" fill="#FFFFFF"/><path d="M24,19c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1V19z" fill="#FFFFFF"/></g></svg>',
  remove: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 12 15"><path fill="#7F8FA4" fill-rule="nonzero" d="M11.75 1.525H8.239c-.028-.317-.124-.853-.453-1.197A1.049 1.049 0 0 0 7 0H4.5c-.313 0-.578.11-.786.328-.33.344-.426.88-.453 1.197H.25A.252.252 0 0 0 0 1.78c0 .14.112.254.25.254h.51l.479 11.7c.01.438.277 1.266 1.227 1.266h7.068c.95 0 1.218-.828 1.227-1.26l.479-11.706h.51c.138 0 .25-.114.25-.254a.252.252 0 0 0-.25-.255zm-8 11.187c0 .14-.112.254-.25.254a.252.252 0 0 1-.25-.254v-8.39c0-.14.112-.254.25-.254s.25.113.25.254v8.39zm2.5 0c0 .14-.112.254-.25.254a.252.252 0 0 1-.25-.254v-8.39c0-.14.112-.254.25-.254s.25.113.25.254v8.39zm2.5 0c0 .14-.112.254-.25.254a.252.252 0 0 1-.25-.254v-8.39c0-.14.112-.254.25-.254s.25.113.25.254v8.39zM4.073.682A.56.56 0 0 1 4.5.508H7c.175 0 .315.057.427.174.201.209.282.577.31.843H3.763c.028-.266.109-.634.31-.843z"/></svg>',
  deploy_as: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="#7F8FA4" fill-rule="evenodd" d="M12 9h2v1h-2v2h-1v-2H9V9h2V7h1v2zm-2 2v2h.262l-.233.582c-.616 1.542-1.714 1.598-2.462.102l-.738-1.477c-.743-1.486-2.54-3.288-4.036-4.036l-1.476-.738C-.17 6.69-.127 5.59 1.419 4.971L12.977.347c1.543-.617 2.294.13 1.676 1.676L13 6.155V6h-3v2H8v3h2z"/></svg>',
  merge_to: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><g fill="#7F8FA4" fill-rule="evenodd"><path d="M9 5V0H0v9h5V5h4z"/><path d="M6 6h9v9H6z"/></g></svg>',
  remove_from: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><g fill="#7F8FA4" fill-rule="evenodd"><path d="M3 3h12v12H3V3zm1 1v10h10V4H4z"/><path d="M13 2V0H0v13h2V2h11z"/><path d="M6 8h6v2H6z"/></g></svg>',
  suspend: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="#7F8FA4" fill-rule="evenodd" d="M7.5 15C3.364 15 0 11.636 0 7.5S3.364 0 7.5 0 15 3.364 15 7.5 11.636 15 7.5 15zM1.25 7.5a6.257 6.257 0 0 0 6.25 6.25 6.221 6.221 0 0 0 3.953-1.414l-8.79-8.79A6.221 6.221 0 0 0 1.25 7.5zM7.5 1.25a6.22 6.22 0 0 0-3.953 1.413l8.79 8.79A6.221 6.221 0 0 0 13.75 7.5 6.257 6.257 0 0 0 7.5 1.25z"/></svg>',
  start: '<svg width="9px" height="15px" viewBox="0 0 9 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-859.000000, -478.000000)" id="Start" fill="#7F8FA4"><g transform="translate(856.000000, 478.000000)"><polygon id="start" points="3 0 12 7.5 3 15"></polygon></g></g></g></svg>',
  restart: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15"><path fill="#7F8FA4" fill-rule="evenodd" d="M13 8.417C13 12.047 10.084 15 6.5 15S0 12.047 0 8.417c0-.346.276-.625.617-.625.34 0 .617.28.617.625 0 2.94 2.362 5.333 5.266 5.333s5.266-2.392 5.266-5.333c0-2.913-2.356-5.282-5.253-5.282h-.081l.787.798a.63.63 0 0 1 0 .884.61.61 0 0 1-.872 0L4.496 2.942a.63.63 0 0 1 0-.884L6.346.183a.612.612 0 0 1 .873 0 .63.63 0 0 1 0 .884l-.807.818h.101c3.578 0 6.487 2.93 6.487 6.532z"/></svg>',
  export_as_blueprint: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="#7F8FA4" fill-rule="nonzero" d="M15 6.838L8.604 0v4.088h-.086c-3.589 0-5.279 1.639-5.336 1.697C-.768 9.28.072 14.169.08 14.218L.224 15l.383-.684c2.36-4.218 5.474-4.848 7.12-4.848.385 0 .688.035.877.065v4.143L15 6.838"/></svg>',
  organisations: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path fill="#F1F6F7" fill-rule="nonzero" d="M18.333 3h.664C19.55 3 20 3.45 20 4.003v11.994C20 16.55 19.55 17 18.997 17H1.003C.45 17 0 16.55 0 15.997V4.003C0 3.45.45 3 1.003 3h.664V2H5v1h1.333V1.069C6.333.479 6.813 0 7.402 0h5.196c.59 0 1.069.48 1.069 1.069V3H15V2h3.333v1zM7.402.667A.402.402 0 0 0 7 1.069V3h6V1.069a.402.402 0 0 0-.402-.402H7.402z"/></svg>',
  superusers: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="#F1F6F7" fill-rule="nonzero" d="M10 0l3.09 6.584L20 7.639l-5 5.125L16.18 20 10 16.583 3.82 20 5 12.764 0 7.64l6.91-1.055L10 0"/></svg>',
  sessions: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" viewBox="0 0 15 20"><path fill="#F1F6F7" fill-rule="nonzero" d="M.503 0C.235 0 0 .326 0 .611v15.037c0 .325.306.454.62.583l9.083 3.743c.314.13.613-.257.613-.583v-3.132h2.597c1.141 0 2.087-.893 2.087-1.98V1.993C15 .907 14.054.007 12.913.007L.503 0zm3.21 1.299h9.2c.414 0 .73.3.73.694V14.28c0 .394-.316.688-.73.688h-2.597V4.355c0-.326-.299-.454-.613-.584L3.713 1.3z"/></svg>',
  environments: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="#F1F6F7" fill-rule="nonzero" d="M10 0A2 2 0 0 0 8.02 1.744a8.5 8.5 0 0 0-2.455 1.018 2 2 0 0 0-2.635.167 2 2 0 0 0-.17 2.632 8.5 8.5 0 0 0-1.015 2.458A2 2 0 0 0 0 10a2 2 0 0 0 1.744 1.981 8.5 8.5 0 0 0 1.018 2.455 2 2 0 0 0 .167 2.635 2 2 0 0 0 2.632.17 8.5 8.5 0 0 0 2.458 1.015 2 2 0 0 0 .567 1.158 2 2 0 0 0 3.397-1.158 8.5 8.5 0 0 0 2.453-1.018 2 2 0 0 0 2.805-2.8 8.5 8.5 0 0 0 1.015-2.457 2 2 0 0 0 1.158-.567 2 2 0 0 0-1.158-3.396 8.5 8.5 0 0 0-1.018-2.454 2 2 0 0 0-2.8-2.805 8.5 8.5 0 0 0-2.457-1.015A2 2 0 0 0 10.001 0zM8.124 2.688A2 2 0 0 0 10 4a2 2 0 0 0 1.874-1.31 7.556 7.556 0 0 1 1.97.815 2 2 0 0 0 2.652 2.651c.363.614.639 1.277.817 1.968a2 2 0 0 0-.003 3.75 7.556 7.556 0 0 1-.815 1.97 2 2 0 0 0-2.652 2.652 7.556 7.556 0 0 1-1.967.817 2 2 0 0 0-3.75-.003 7.556 7.556 0 0 1-1.968-.814 2 2 0 0 0-.4-2.253 2 2 0 0 0-2.253-.399 7.556 7.556 0 0 1-.817-1.967A2 2 0 0 0 4 10a2 2 0 0 0-1.31-1.874 7.556 7.556 0 0 1 .815-1.968 2 2 0 0 0 2.253-.4 2 2 0 0 0 .398-2.253 7.556 7.556 0 0 1 1.968-.817zM10.029 8a2 2 0 1 0-.058 4 2 2 0 0 0 .058-4z"/></svg>',
  users: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19"><g fill="#F1F6F7" fill-rule="nonzero"><path d="M13.671 14.296l-3.184-1.592a.876.876 0 0 1-.487-.788v-1.127c.076-.093.157-.2.24-.317a7.629 7.629 0 0 0 .984-1.933c.47-.216.776-.68.776-1.206V6c0-.321-.12-.632-.333-.875V3.352c.018-.183.092-1.275-.698-2.175C10.285.396 9.173 0 7.667 0 6.16 0 5.049.396 4.364 1.177c-.79.9-.716 1.992-.697 2.175v1.773A1.33 1.33 0 0 0 3.333 6v1.333c0 .406.185.784.5 1.037A7.005 7.005 0 0 0 5 10.782v1.103a.88.88 0 0 1-.459.773l-2.974 1.623A3.005 3.005 0 0 0 0 16.92v1.412h15.333v-1.347a2.99 2.99 0 0 0-1.662-2.69"/><path d="M18.489 14.675l-3.241-1.403a.66.66 0 0 1-.235-.257l2.175-.002s.126.013.321.013c.358 0 .88-.041 1.333-.236a.989.989 0 0 0 .414-1.477c-.621-.885-2.072-3.196-2.117-5.541-.001-.04-.133-4.028-4.07-4.06-.396.003-.77.052-1.124.138.264.698.24 1.323.222 1.525v1.578c.216.307.333.672.333 1.047v1.333c0 .636-.335 1.224-.869 1.554a8.096 8.096 0 0 1-1.131 2.076v.953c0 .147.079.275.21.34l3.185 1.593a3.488 3.488 0 0 1 1.938 3.137v1.347H20v-1.232c0-1.03-.573-1.957-1.511-2.426"/></g></svg',
  logo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.8 16" width="100%"><g fill-rule="evenodd"> <polygon id="Shape" points="0 0.4 2.7 0.4 6.4 10 10 0.4 12.5 0.4 7.6 12.9 5 12.9 0 0.4"/><path id="Shape-2" d="M29.7.4h2.2v2H32a2.09,2.09,0,0,1,.4-.6,3.51,3.51,0,0,1,.9-.7A3.37,3.37,0,0,1,34.5.5,3.64,3.64,0,0,1,36,.3a4.75,4.75,0,0,1,2.4.6A4.4,4.4,0,0,1,40,2.6,3.51,3.51,0,0,1,41.7.9,4.56,4.56,0,0,1,43.9.3a6,6,0,0,1,2.4.5,3,3,0,0,1,1.4,1.3,6.12,6.12,0,0,1,.7,1.7,6.48,6.48,0,0,1,.2,2V13H46.2V6.1a5.28,5.28,0,0,0-.1-1.3,4,4,0,0,0-.4-1.3,3,3,0,0,0-.8-.8,2.65,2.65,0,0,0-1.4-.3,2.61,2.61,0,0,0-2.4,1,4.53,4.53,0,0,0-.7,2.7v6.8H38V6.4a9.7,9.7,0,0,0-.1-1.7,5,5,0,0,0-.4-1.3,3.45,3.45,0,0,0-.8-.9,1.81,1.81,0,0,0-1.3-.3,5,5,0,0,0-1.2.2,3.59,3.59,0,0,0-1,.7,3.92,3.92,0,0,0-.8,1.4,5.24,5.24,0,0,0-.2,1.8v6.5H29.8L29.7.4Z"/> <path d="M51.6.4H54V2.2h.1A6,6,0,0,1,56,.6,5.33,5.33,0,0,1,58.4,0,7.51,7.51,0,0,1,61,.5a5.58,5.58,0,0,1,2,1.4,8.58,8.58,0,0,1,1.3,2,7.42,7.42,0,0,1,.5,2.5A7.51,7.51,0,0,1,64.3,9,4.64,4.64,0,0,1,63,11a5.33,5.33,0,0,1-2,1.3,4.39,4.39,0,0,1-2.7.7,5.59,5.59,0,0,1-2.5-.5A4.53,4.53,0,0,1,54,11h-.1v5H51.6ZM58,2.3a4.67,4.67,0,0,0-1.7.3,7.3,7.3,0,0,0-1.3.9,9.13,9.13,0,0,0-.8,1.3,11.27,11.27,0,0,0-.3,1.8,4.67,4.67,0,0,0,.3,1.7A3.22,3.22,0,0,0,55,9.6a2.38,2.38,0,0,0,1.3.9,3.23,3.23,0,0,0,1.7.3,3.61,3.61,0,0,0,1.8-.3,6,6,0,0,0,1.3-.9,9.13,9.13,0,0,0,.8-1.3,5.08,5.08,0,0,0,.3-1.7,5.84,5.84,0,0,0-.4-1.8A3.22,3.22,0,0,0,61,3.5a3.45,3.45,0,0,0-1.2-.9A9.66,9.66,0,0,0,58,2.3Z"/><path d="M19.7,13.3a5.91,5.91,0,0,0,4.6-2.1v1.7h2.1V.3H24.3V2.2A5.91,5.91,0,0,0,19.7.1a6.3,6.3,0,0,0-6.2,6.5A6.42,6.42,0,0,0,19.7,13.3Zm.3-11a4.19,4.19,0,0,1,4.1,4.4A4.25,4.25,0,0,1,20,11.1c-2.6,0-4.1-2-4.1-4.4A4.13,4.13,0,0,1,20,2.3Z"/> </g></svg>',
  scheduler: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><g fill="#F1F6F7" fill-rule="evenodd"><rect width="8" height="8"/><rect width="8" height="8" x="12"/><rect width="8" height="8" x="12" y="12"/><rect width="8" height="8" y="12"/></g></svg>'
};

angular.module('vamp-ui').directive('svgicon', function () {
  function link(scope, element, attrs) {
    function renderSVG() {
      element.html(icons[attrs.type]);
    }
    renderSVG();
  }

  return {
    link: link,
    restrict: 'E'
  };
});

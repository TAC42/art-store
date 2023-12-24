import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class SvgRenderService {
  icons: { [key: string]: string } = {
    home: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
      <path d="M160-120v-375l-72 55-48-64 120-92v-124h80v63l240-183 440 336-48 63-72-54v375H160Zm80-80h200v-160h80v160h200v-356L480-739 240-556v356Zm-80-560q0-50 35-85t85-35q17 0 28.5-11.5T320-920h80q0 50-35 85t-85 35q-17 0-28.5 11.5T240-760h-80Zm80 560h480-480Z"/>
    </svg>`,

    time: `<svg xmlns="http://www.w3.org/2000/svg" height="50" viewBox="0 -960 960 960" width="50">
      <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
    </svg>`,

    countdown: `<svg xmlns="http://www.w3.org/2000/svg" height="50" viewBox="0 -960 960 960" width="50">
      <path d="M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120Zm160-360q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z"/>
    </svg>`,

    cords: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
      <path d="M480-301q99-80 149.5-154T680-594q0-56-20.5-95.5t-50.5-64Q579-778 544-789t-64-11q-29 0-64 11t-65 35.5q-30 24.5-50.5 64T280-594q0 65 50.5 139T480-301Zm0 101Q339-304 269.5-402T200-594q0-71 25.5-124.5T291-808q40-36 90-54t99-18q49 0 99 18t90 54q40 36 65.5 89.5T760-594q0 94-69.5 192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520ZM200-80v-80h560v80H200Zm280-514Z"/>
    </svg>`,

    watcher: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
      <path d="M440-240q116 0 198-81.5T720-520q0-116-82-198t-198-82q-117 0-198.5 82T160-520q0 117 81.5 198.5T440-240Zm0-280Zm0 160q-83 0-147.5-44.5T200-520q28-70 92.5-115T440-680q82 0 146.5 45T680-520q-29 71-93.5 115.5T440-360Zm0-60q55 0 101-26.5t72-73.5q-26-46-72-73t-101-27q-56 0-102 27t-72 73q26 47 72 73.5T440-420Zm0-40q25 0 42.5-17t17.5-43q0-25-17.5-42.5T440-580q-26 0-43 17.5T380-520q0 26 17 43t43 17Zm0 300q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T80-520q0-74 28.5-139.5t77-114.5q48.5-49 114-77.5T440-880q74 0 139.5 28.5T694-774q49 49 77.5 114.5T800-520q0 64-21 121t-58 104l159 159-57 56-159-158q-47 37-104 57.5T440-160Z"/>
    </svg>`,

    ocLogo: `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 192.756 192.756">
      <g fill-rule="evenodd" clip-rule="evenodd">
        <path fill="#fff" d="M0 0h192.756v192.756H0V0z"/>
        <path d="M96.378 184.252c48.53 0 87.874-39.344 87.874-87.874S144.908 8.504 96.378 8.504c-48.531 0-87.874 39.343-87.874 87.874s39.343 87.874 87.874 87.874z"/>
        <path d="M96.378 175.143c43.501 0 78.765-35.264 78.765-78.765 0-43.5-35.264-78.765-78.765-78.765-43.5 0-78.765 35.265-78.765 78.765 0 43.501 35.265 78.765 78.765 78.765z" fill="#fff"/>
        <path d="m155.838 127.812-8.07-4.229a58.387 58.387 0 0 1-25.992 25.104c-7.539-3.586-14.178-8.715-19.604-15.084 6.947-10.736 11.061-23.5 11.061-37.226 0-13.762-4.135-26.56-11.23-37.217 5.377-6.475 12.057-11.421 19.773-15.093a58.374 58.374 0 0 1 25.992 25.105l8.07-4.229c-7.365-13.905-19.467-24.917-34.154-30.887a67.265 67.265 0 0 0-25.565 18.097C89.293 44.428 80.996 38 71.293 34.056c-24.769 9.917-42.16 34.011-42.16 62.321 0 28.011 17.481 52.343 41.835 62.452 9.747-3.902 18.366-10.02 25.371-17.779 6.986 7.643 15.595 13.744 25.345 17.648 14.687-5.969 26.789-16.981 34.154-30.886zm-65.09 5.649a58.114 58.114 0 0 1-19.363 15.227c-19.301-9.457-33.143-29.367-33.143-52.31 0-23.18 13.516-42.973 33.143-52.31 7.443 3.621 13.88 9.152 19.131 15.441-6.954 10.569-10.991 23.229-10.991 36.869-.001 13.753 4.104 26.513 11.223 37.083zm5.642-8.527c5.012-8.43 7.733-18.176 7.733-28.556 0-10.465-2.766-20.284-7.605-28.766-4.682 8.338-7.885 18.473-7.885 28.766 0 10.413 2.728 20.143 7.757 28.556z"/>
      </g>
    </svg>`,

    burgerMenuIcon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#fff" fill-opacity=".01" d="M0 0h48v48H0z"/>
      <path d="M7.95 11.95h32m-32 12h32m-32 12h32" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    searchIcon: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="m15.7 14.3-4.2-4.2c-.2-.2-.5-.3-.8-.3.8-1 1.3-2.4 1.3-3.8 0-3.3-2.7-6-6-6S0 2.7 0 6s2.7 6 6 6c1.4 0 2.8-.5 3.8-1.4 0 .3 0 .6.3.8l4.2 4.2c.2.2.5.3.7.3s.5-.1.7-.3c.4-.3.4-.9 0-1.3zM6 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
    </svg>`
  }

  constructor() { }

  getSvg(name: string): string {
    return this.icons[name] || ''
  }
}

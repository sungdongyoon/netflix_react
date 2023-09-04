import { DefaultTheme } from "styled-components"


// theme는 기본적으로 any타입이기 때문에 타입정의를 하지 않으면 디버깅을 할 수 없다
// 때문에 DefaultTheme로 타입정의를 해야한다


export const theme: DefaultTheme = {
  red: "#e51013",
  black: {
    veryDark: "#141414",
    darker: "#181818",
    lighter: "#2f2f2f",
  },
  white: {
    lighter: "#fff",
    darker: "#e5e5e5",
  }
}

const defaultStyle = {
  '&multiLine': {
    control: {
      fontFamily: 'lato',
      minHeight: 63,
    },
    highlighter: {
      padding: 9,
    },
    input: {
      padding: 4,
      border: '1px solid #E2E7E9',
      outline: 'none',
      borderRadius: "10px"
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 200,

    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 10,
      border: '1px inset',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      borderRadius: '20px',
      // border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 20,
    },
    item: {
      padding: '0px 5px',
      // borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#e0e0e0',
      },
    },
  },
}

export default defaultStyle;
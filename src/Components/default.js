const defaultStyle = {
  control: {
    fontFamily: 'lato'
  },

  '&multiLine': {
    control: {
      minHeight: 63,
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
    },
    input: {
      padding: 9,
      border: '2px solid silver',
      outline: 'none',
      borderRadius: "10px"
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

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
    fontFamily: 'lato',
    list: {
      backgroundColor: 'white',
      borderRadius: '20px',
      // border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 18,
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
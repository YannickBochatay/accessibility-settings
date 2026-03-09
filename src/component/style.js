export const style = /*css*/`
  :host {
    font-size:18px;
    line-height:1.5;
    position:fixed;
    top:40%;
    right:5px;
    left:unset;
  }
  :host([side="left"]) {
    right:unset;
    left:5px;
    details {
      align-items: flex-start;
    }
  }
  :host([all]), :host([dyslexic-font]) {
    form .field[part=dyslexic-font] {
      display:block;
    }
  }
  :host([all]), :host([invert-colors]) {
    form .field[part=invert-colors] {
      display:block;
    }
  }
  :host([all]), :host([contrast]) {
    form .field[part=contrast] {
      display:block;
    }
  }
  :host([all]), :host([font-size]) {
    form .field[part=font-size] {
      display:block;
    }
  }
  :host([all]), :host([line-height]) {
    form .field[part=line-height] {
      display:block;
    }
  }
  :host([rounded]) ::slotted([slot=icon]), :host([rounded]) #default-icon {
    border-radius:50%;
  }

  details {
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    
    summary {
      cursor:pointer;
      display:flex;
      align-items:center;
      
      #default-icon {
        border:1px solid #ccc;
        background-color:#ddd;
        border-radius:5px;
        width:40px;
        height:40px;
        &:hover {
          background-color:#e1e1e1;
        }
      }
      ::slotted([slot=icon]) {
        border:1px solid #ccc;
        background-color:#ddd;
        border-radius:5px;
        padding:0 8px;
        font-size:30px;
      }
    }

    form {
      font-size:1em;
      border:1px solid #ccc;
      color:#222;
      background-color:#fafafa;
      line-height:2.5;
      text-align: left;
      border-radius:5px;

      .field, ::slotted([slot=option])  {
        padding: 0 25px 0 15px;
        display:block;
        &:hover {
          background-color:#eee;
        }
      }

      .field {
        display:none;
      }

      input {
        font-size:1em;
        font-family:unset;
      }

      input[type=number] {
        width:5ch;
        border:1px solid #ccc;
        border-radius:5px;
        padding:3px;
      }

      [part=buttons] {
        text-align:center;
        margin:0 15px;
      }
    }
  }
`

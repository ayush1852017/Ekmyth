function navbar() {
  return `
      <div class="left">
        <div class="logo">
          <a href="index.html">
            E<span style="letter-spacing: 0.5rem">k</span>M<span>y</span><span>t</span><span>h</span>
          </a>
        </div>
      </div>
      <div class="right">
        <ul>
          <li><a href="./index.html"> <span style="color: red">H</span>ome</a></li>
          <li><a href="./write.html"> <span style="color: red">W</span>riting</a></li>
          <li><a href="./read.html"> <span style="color: red">R</span>ead</a></li>
        </ul>
      </div>  
    `;
}

export { navbar };

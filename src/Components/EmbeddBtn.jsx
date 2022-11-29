import React from "react";

const EmbeddBtn = ({ visibility, changeData, embedText }) => {
  return (
    <div className={`${visibility === true ? "block" : "hidden"}`}>
      <input
        type="text"
        value={embedText}
        placeholder="Embed YouTube Link"
        name="data"
        id="data"
        className={`lato rounded-md border border-[#d4d4d4]  -mt-2  w-[37rem] mx-5 px-3 py-1 text-lg `}
        onChange={(e) => changeData(e.target.value)}
      />
    </div>
  );
};

export default EmbeddBtn;

import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {

  it('create an truncate pipe instance', () => {
    expect(new TruncatePipe()).toBeTruthy();
  });

  let pipe=new TruncatePipe();
  it('truncating "This a long string to truncate" string', ()=>{
    expect(pipe.transform("This a long string to truncate", 4, false, "")).toBe("This");
  });

  it('truncating "This a long string to truncate" string with default ellipsis', ()=>{
    expect(pipe.transform("This a long string to truncate", 4, false)).toBe("This...");
  });

  it('truncating "This a long string to truncate" string with custom ellipsis', ()=>{
    expect(pipe.transform("This a long string to truncate", 4, false, "..")).toBe("This..");
  });

  it('truncating "This a long string to truncate" string with complete words', ()=>{
    expect(pipe.transform("This a long string to truncate", 15, true)).toBe("This a long...");
  });

});

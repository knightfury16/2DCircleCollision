class utility{

    constructor()
    {
        this.play = true;
    }

    static clickStop(canvas_ref)
    {
        canvas_ref.mouseClicked(() => {
            if(this.play){noLoop();this.play = false;}
            else{
              loop();
              this.play = true;
            }
        });

    }


    static frameCount()
    {
        this.div = createDiv("FrameRate = ");
        this.span = createSpan("60");
        this.span.parent(this.div);

        setInterval(() =>{
            let fr = ceil(frameRate());
            this.span.html(fr);
        }, 1000);


    }



}
import {Card, CardContent, CardDescription, CardTitle} from "@/components/ui/card";


export function Features() {
    return (
        <div className="grid md:grid-cols-3 place-items-center place-content-between gap-8 mt-10 text-[1rem] text-justify font-roboto font-normal" >

            <Card className="flex flex-col w-84 h-84 place-items-center p-4 shadow-xl shadow-black/30">
                <CardContent>

                    <svg xmlns="http://www.w3.org/2000/svg" width="92" height="92" fill="#6a5acd" viewBox="0 0 256 256">
                        <path
                            d="M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z"></path>
                    </svg>

                </CardContent>
                <CardTitle className="text-[2rem] font-source text-primary">
                    Fast Delivery
                </CardTitle>
                <CardDescription>
                    <p>Receive your currency quickly and
                        efficiently. Most orders are delivered within 30 minutes</p>
                </CardDescription>
            </Card>

            <Card className="flex flex-col w-84 h-84 place-items-center p-4 shadow-xl shadow-black/30">
                <CardContent>
                    <svg xmlns="http://www.w3.org/2000/svg" width="92" height="92" fill="#6a5acd" viewBox="0 0 256 256">
                        <path
                            d="M201.89,54.66A103.43,103.43,0,0,0,128.79,24H128A104,104,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88.12,88.12,0,0,1,190.54,65.93,87.39,87.39,0,0,1,215.65,120H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h24a24,24,0,0,1-24,24H136a8,8,0,0,0,0,16h56a40,40,0,0,0,40-40V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm128,56a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24v56Z"></path>
                    </svg>
                </CardContent>
                <CardTitle className="text-[2rem] font-source text-primary">
                    24/7 Support
                </CardTitle>

                <CardDescription>
                    <p>Our dedicated support team is available around the clock to answer your questions and assist with
                        any issues</p>
                </CardDescription>
            </Card>

            <Card className="flex flex-col w-84 h-84 place-items-center p-4 shadow-xl shadow-black/30">
                <CardContent>
                    <svg xmlns="http://www.w3.org/2000/svg" width="92" height="92" fill="#6a5acd" viewBox="0 0 256 256">
                        <path
                            d="M230.33,141.06a24.43,24.43,0,0,0-21.24-4.23l-41.84,9.62A28,28,0,0,0,140,112H89.94a31.82,31.82,0,0,0-22.63,9.37L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9ZM164,96a36,36,0,0,0,5.9-.48,36,36,0,1,0,28.22-47A36,36,0,1,0,164,96Zm60-12a20,20,0,1,1-20-20A20,20,0,0,1,224,84ZM164,40a20,20,0,0,1,19.25,14.61,36,36,0,0,0-15,24.93A20.42,20.42,0,0,1,164,80a20,20,0,0,1,0-40Z"></path>
                    </svg>
                </CardContent>

                <CardTitle className="text-[2rem] font-source text-primary">
                    Refound Guarantee
                </CardTitle>
                <CardDescription>
                    <p>Your satisfaction is our priority. We offer a money-back guarantee if you are not completely satisfied with your purchase.</p>
                </CardDescription>
            </Card>
        </div>
    )
}
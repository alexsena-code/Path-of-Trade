import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

export function FaqSection() {
    return (
        <section className=" container mx-auto mb-16 bg-background">
            <div className="grid md:grid-cols-2 mx-auto ">
                <div className="flex flex-col">
                    <h2 className="text-6xl font-bold  font-source text-left mb-4 text-primary-font">FAQ</h2>
                    <span className=" font-inter font-black text-primary text-lg tracking-wider">Answers to some question you might have.</span>
                </div>

                <Accordion type={"single"} collapsible className="w-full">
                    <AccordionItem value="item 1">
                        <AccordionTrigger className=" font-inter font-bold text-bold  px-4 text-lg">Is it
                            accessible?</AccordionTrigger>
                        <AccordionContent className="font-inter px-4 text-base">A little bumpy start but not OGs fault really, their support team were amazing and sorted everything straight away! Thanks for the great care and attention you guys give and support offered...you can trust them and my team were amazing! Thx folks!

                        </AccordionContent>
                    </AccordionItem>
                        <AccordionItem value="item 2">
                            <AccordionTrigger className=" font-inter font-bold text-bold  px-4 text-lg">Is it
                                accessible?</AccordionTrigger>
                            <AccordionContent className="font-inter px-4 text-base">A little bumpy start but not OGs fault really, their support team were amazing and sorted everything straight away! Thanks for the great care and attention you guys give and support offered...you can trust them and my team were amazing! Thx folks!
                            </AccordionContent>
                    </AccordionItem>

                <AccordionItem value="item 3">
                    <AccordionTrigger className=" font-inter font-bold text-bold  px-4 text-lg">Is it
                        accessible?</AccordionTrigger>
                    <AccordionContent className="font-inter px-4 text-base">A little bumpy start but not OGs fault really, their support team were amazing and sorted everything straight away! Thanks for the great care and attention you guys give and support offered...you can trust them and my team were amazing! Thx folks!
                    </AccordionContent>
                </AccordionItem>

                    <AccordionItem value="item 4">
                        <AccordionTrigger className=" font-inter font-bold text-bold  px-4 text-lg">Is it
                            accessible?</AccordionTrigger>
                        <AccordionContent className="font-inter px-4 text-base">A little bumpy start but not OGs fault really, their support team were amazing and sorted everything straight away! Thanks for the great care and attention you guys give and support offered...you can trust them and my team were amazing! Thx folks!
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item 5">
                        <AccordionTrigger className=" font-inter font-bold text-bold  px-4 text-lg">Is it
                            accessible?</AccordionTrigger>
                        <AccordionContent className="font-inter px-4 text-base">A little bumpy start but not OGs fault really, their support team were amazing and sorted everything straight away! Thanks for the great care and attention you guys give and support offered...you can trust them and my team were amazing! Thx folks!
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    )

}
import { Card } from "@/components/ui/card";

export function CityCard() {
  return (
    <Card className="bg-white mt-4 rounded-lg shadow-sm overflow-hidden relative">
      <img
        src="https://media.istockphoto.com/id/493621192/photo/melbourne-at-dusk.jpg?s=612x612&w=0&k=20&c=ogjQ1VOGyRdWvLfQLfMADI4bKdKC_nv2T2jSRtM8CCA="
        alt="Melbourne cityscape"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
        <h3 className="text-2xl font-semibold text-white absolute bottom-4 left-4">
          Melbourne
        </h3>
      </div>
    </Card>
  );
}

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { app } from "@/atoms/kuepa";
import { LeadService } from "@/services/leadService";
import { useToast } from "@/components/hooks/use-toast";

export interface LeadFormValues {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  interestProgram: string;
}

const mockPrograms = [
  { name: "Desarrollo Web" },
  { name: "Marketing Digital" },
  { name: "Diseño UX/UI" },
  { name: "Data Science" },
];


export default function Leads() {
  const { id } = useParams();
  const leadService = new LeadService('/lead')
  const [programs] = useState(mockPrograms);
  const location = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<LeadFormValues>({
    first_name: "",
    last_name: "",
    email: "",
    mobile_phone: "",
    interestProgram: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    app.set({
      ...(app.get() || {}),
      app: "kuepa",
      module: "leads",
      window: "crm",
      back: null,
      accent: "purple",
      breadcrumb: [{ title: "Leads", url: "/leads" }],
    });
    getData();
  }, []);

  const getData = async () => {
    if (id) {
      const lead = await leadService.get({ _id: id });
      console.log("lead", lead);
      if (!lead) return location("/home");
      setFormData(lead.lead);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? (value ? parseInt(value) : undefined) : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleDelete = async () => {
    const response = await leadService.upsert({_id: id, deleted: true})
    if (response.code == 200) {
      toast({
        title: "Lead eliminado con exito",
        description: `${formData.first_name} ${formData.last_name} ha sido eliminado.`,
        variant: "default",
      });
      location("/home");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = "El nombre es requerido";
    if (!formData.last_name) newErrors.last_name = "El apellido es requerido";
    if (!formData.email) newErrors.email = "El email es requerido";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) newErrors.email = "Email invalido";
    if (!formData.mobile_phone) newErrors.mobile_phone = "El telefono móvil es requerido";
    if (!formData.interestProgram) newErrors.interestProgram = "Seleccione un programa";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();
    if (validateForm()) {
      const response = await leadService.upsert(formData)

      if (response.code == 200) {
        toast({
          title: `Lead ${id ? "actualizado" : "creado"} con exito`,
          description: `${formData.first_name} ${formData.last_name} ha sido ${id ? "actualizado" : "creado"}.`,
          variant: "default",
          duration: 3000,
        })
        location('/home')
      } else {
        alert("Error al guardar el lead")
      }
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-2xl font-title text-purple-800 flex-1">
          {id ? "Editar Lead" : "Nuevo Lead"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nombre</Label>
              <Input id="first_name" name="first_name" placeholder="Nombre" value={formData.first_name} onChange={handleChange} className={errors.first_name ? "border-red-500" : ""} />
              {errors.first_name && <p className="text-sm font-medium text-red-500">{errors.first_name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Apellido</Label>
              <Input id="last_name" name="last_name" placeholder="Apellido" value={formData.last_name} onChange={handleChange} className={errors.last_name ? "border-red-500" : ""} />
              {errors.last_name && <p className="text-sm font-medium text-red-500">{errors.last_name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="correo@ejemplo.com" value={formData.email} onChange={handleChange} className={errors.email ? "border-red-500" : ""} />
              {errors.email && <p className="text-sm font-medium text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile_phone">Teléfono</Label>
              <Input id="mobile_phone" name="mobile_phone" type="mobile_phone" placeholder="Teléfono" value={formData.mobile_phone} onChange={handleChange} className={errors.mobile_phone ? "border-red-500" : ""} />
              {errors.mobile_phone && <p className="text-sm font-medium text-red-500">{errors.mobile_phone}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestProgram">Programa de interés</Label>
              <Select value={formData.interestProgram} onValueChange={(value) => handleSelectChange(value, "interestProgram")}>
                <SelectTrigger id="interestProgram" className={errors.interestProgram ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar programa" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.name} value={program.name}>{program.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.interestProgram && <p className="text-sm font-medium text-red-500">{errors.interestProgram}</p>}
            </div>
          </div>
          <CardFooter className="px-0 pt-6 flex justify-between gap-2">
            <div>
              {id && <Button type="button" className="bg-red-700 hover:bg-red-800 text-white" onClick={handleDelete}>Eliminar</Button>}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" type="button" to="/home">Cancelar</Button>
              <Button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white" disabled={isLoading}>{isLoading ? "Guardando..." : id ? "Actualizar" : "Guardar"}</Button>
            </div>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

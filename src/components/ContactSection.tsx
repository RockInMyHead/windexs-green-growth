import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const ContactSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit triggered');
    
    if (!formData.name || !formData.email || !formData.message) {
      console.log('Validation failed');
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    console.log('Sending form data:', formData);

    try {
      console.log('Making fetch request...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('https://wizary.windexs.ru/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
    setIsSubmitted(true);
        toast.success(data.message);
    
    // Reset form after animation
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error sending form:', error);

      if (error.name === 'AbortError') {
        console.error('Request timed out');
        toast.error("Превышено время ожидания ответа сервера. Попробуйте позже.");
      } else if (error.message.includes('fetch')) {
        console.error('Network error');
        toast.error("Проблема с подключением к серверу. Проверьте интернет-соединение.");
      } else {
        console.error('Unknown error:', error.message);
        toast.error("Произошла ошибка при отправке заявки. Попробуйте позже.");
      }
    }
  };

  return (
    <section className="py-24 px-4 relative" id="contact">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Свяжитесь <span className="gradient-text">с нами</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Оставьте заявку, и мы подберём оптимальное решение для вашего бизнеса
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card-gradient border border-border/50 rounded-3xl p-8 md:p-12"
        >
          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle className="w-20 h-20 text-primary mb-6" />
              </motion.div>
              <h3 className="text-2xl font-display font-bold mb-2">Заявка отправлена!</h3>
              <p className="text-muted-foreground">Мы свяжемся с вами в ближайшее время</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground/80">
                    Имя *
                  </label>
                  <Input
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-secondary/50 border-border/50 focus:border-primary h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground/80">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-secondary/50 border-border/50 focus:border-primary h-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/80">
                  Телефон
                </label>
                <Input
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-secondary/50 border-border/50 focus:border-primary h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/80">
                  Сообщение *
                </label>
                <Textarea
                  placeholder="Расскажите о вашем проекте..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-secondary/50 border-border/50 focus:border-primary min-h-32 resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full py-6 text-lg glow-effect group">
                Отправить заявку
                <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

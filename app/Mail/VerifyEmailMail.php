<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmailMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userEmail,
        public string $userName,
        public string $verificationUrl,
        public string $token
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: config('mail.from.address'),
            to: $this->userEmail,
            subject: '🌟 Welcome to HVK 👋 Please verify your email',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails/verify-email',
            with: [
                'userName' => $this->userName,
                'verificationUrl' => $this->verificationUrl,
                'token' => $this->token,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

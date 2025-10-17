"""
Stripe Integration Routes for AI Safety Empire
Handles checkout, subscriptions, and webhooks
"""

from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel
from typing import Optional
import stripe
import os
from datetime import datetime

router = APIRouter(prefix="/api/v1/stripe", tags=["stripe"])

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# Pricing configuration
PRICE_IDS = {
    "professional_monthly": "price_1QVkTYBqQ3n9Ug8OOqbVGnXN",
    "professional_yearly": "price_1QVkTYBqQ3n9Ug8OEVuCQlGg",
    "business_monthly": "price_1QVkTYBqQ3n9Ug8OXGzLdWGZ",
    "business_yearly": "price_1QVkTYBqQ3n9Ug8OYgzGXGGG",
    "enterprise_monthly": "price_1QVkTYBqQ3n9Ug8OzGGGGGGG",
    "enterprise_yearly": "price_1QVkTYBqQ3n9Ug8OzGGGGGGH"
}

# JABL token allocation per tier
JABL_TOKENS = {
    "professional": 1000,
    "business": 10000,
    "enterprise": 100000
}

# API call limits per tier
API_LIMITS = {
    "free": 100,
    "professional": 10000,
    "business": 100000,
    "enterprise": -1  # Unlimited
}


class CheckoutRequest(BaseModel):
    price_id: str
    tier: str
    billing: str
    success_url: str
    cancel_url: str
    customer_email: Optional[str] = None


class SubscriptionResponse(BaseModel):
    id: str
    customer_id: str
    status: str
    tier: str
    billing: str
    jabl_tokens: int
    api_limit: int
    current_period_end: int


@router.post("/create-checkout")
async def create_checkout_session(request: CheckoutRequest):
    """
    Create a Stripe Checkout session for subscription purchase
    """
    try:
        # Validate price ID
        if request.price_id not in PRICE_IDS.values():
            raise HTTPException(status_code=400, detail="Invalid price ID")
        
        # Create checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': request.price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            customer_email=request.customer_email,
            metadata={
                'tier': request.tier,
                'billing': request.billing,
                'jabl_tokens': JABL_TOKENS.get(request.tier, 0),
                'api_limit': API_LIMITS.get(request.tier, 100)
            },
            subscription_data={
                'metadata': {
                    'tier': request.tier,
                    'billing': request.billing
                }
            }
        )
        
        return {
            "id": session.id,
            "url": session.url
        }
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/verify-session/{session_id}")
async def verify_checkout_session(session_id: str):
    """
    Verify a checkout session and return subscription details
    """
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        if session.payment_status != 'paid':
            raise HTTPException(status_code=400, detail="Payment not completed")
        
        return {
            "customer_email": session.customer_details.email,
            "subscription_id": session.subscription,
            "customer_id": session.customer,
            "metadata": session.metadata
        }
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/subscription/{subscription_id}")
async def get_subscription(subscription_id: str):
    """
    Get subscription details
    """
    try:
        subscription = stripe.Subscription.retrieve(subscription_id)
        
        tier = subscription.metadata.get('tier', 'professional')
        
        return SubscriptionResponse(
            id=subscription.id,
            customer_id=subscription.customer,
            status=subscription.status,
            tier=tier,
            billing=subscription.metadata.get('billing', 'monthly'),
            jabl_tokens=JABL_TOKENS.get(tier, 0),
            api_limit=API_LIMITS.get(tier, 100),
            current_period_end=subscription.current_period_end
        )
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/cancel-subscription/{subscription_id}")
async def cancel_subscription(subscription_id: str):
    """
    Cancel a subscription
    """
    try:
        subscription = stripe.Subscription.delete(subscription_id)
        
        return {
            "id": subscription.id,
            "status": subscription.status,
            "canceled_at": subscription.canceled_at
        }
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None)
):
    """
    Handle Stripe webhooks for subscription events
    """
    try:
        payload = await request.body()
        
        # Verify webhook signature
        try:
            event = stripe.Webhook.construct_event(
                payload, stripe_signature, STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Handle different event types
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            await handle_checkout_completed(session)
            
        elif event['type'] == 'customer.subscription.created':
            subscription = event['data']['object']
            await handle_subscription_created(subscription)
            
        elif event['type'] == 'customer.subscription.updated':
            subscription = event['data']['object']
            await handle_subscription_updated(subscription)
            
        elif event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            await handle_subscription_deleted(subscription)
            
        elif event['type'] == 'invoice.payment_succeeded':
            invoice = event['data']['object']
            await handle_payment_succeeded(invoice)
            
        elif event['type'] == 'invoice.payment_failed':
            invoice = event['data']['object']
            await handle_payment_failed(invoice)
        
        return {"status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def handle_checkout_completed(session):
    """Handle successful checkout"""
    # TODO: Create user account
    # TODO: Send welcome email
    # TODO: Allocate JABL tokens
    # TODO: Set API limits
    print(f"Checkout completed: {session['id']}")
    print(f"Customer: {session['customer']}")
    print(f"Subscription: {session['subscription']}")


async def handle_subscription_created(subscription):
    """Handle new subscription"""
    # TODO: Update user subscription status
    # TODO: Allocate monthly JABL tokens
    # TODO: Send confirmation email
    print(f"Subscription created: {subscription['id']}")
    print(f"Customer: {subscription['customer']}")
    print(f"Status: {subscription['status']}")


async def handle_subscription_updated(subscription):
    """Handle subscription update"""
    # TODO: Update user subscription tier
    # TODO: Adjust JABL token allocation
    # TODO: Update API limits
    print(f"Subscription updated: {subscription['id']}")
    print(f"Status: {subscription['status']}")


async def handle_subscription_deleted(subscription):
    """Handle subscription cancellation"""
    # TODO: Downgrade user to free tier
    # TODO: Stop JABL token allocation
    # TODO: Send cancellation email
    print(f"Subscription deleted: {subscription['id']}")
    print(f"Customer: {subscription['customer']}")


async def handle_payment_succeeded(invoice):
    """Handle successful payment"""
    # TODO: Allocate monthly JABL tokens
    # TODO: Send payment receipt
    # TODO: Update billing history
    print(f"Payment succeeded: {invoice['id']}")
    print(f"Amount: {invoice['amount_paid']}")


async def handle_payment_failed(invoice):
    """Handle failed payment"""
    # TODO: Send payment failed email
    # TODO: Retry payment
    # TODO: Suspend account if multiple failures
    print(f"Payment failed: {invoice['id']}")
    print(f"Customer: {invoice['customer']}")


@router.get("/customer/{customer_id}/subscriptions")
async def get_customer_subscriptions(customer_id: str):
    """
    Get all subscriptions for a customer
    """
    try:
        subscriptions = stripe.Subscription.list(customer=customer_id)
        
        return {
            "subscriptions": [
                {
                    "id": sub.id,
                    "status": sub.status,
                    "tier": sub.metadata.get('tier', 'professional'),
                    "billing": sub.metadata.get('billing', 'monthly'),
                    "current_period_end": sub.current_period_end
                }
                for sub in subscriptions.data
            ]
        }
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/prices")
async def get_prices():
    """
    Get all available pricing plans
    """
    return {
        "professional": {
            "monthly": {
                "price_id": PRICE_IDS["professional_monthly"],
                "amount": 4900,  # $49.00
                "currency": "usd",
                "interval": "month",
                "jabl_tokens": JABL_TOKENS["professional"],
                "api_limit": API_LIMITS["professional"]
            },
            "yearly": {
                "price_id": PRICE_IDS["professional_yearly"],
                "amount": 47000,  # $470.00
                "currency": "usd",
                "interval": "year",
                "jabl_tokens": JABL_TOKENS["professional"],
                "api_limit": API_LIMITS["professional"]
            }
        },
        "business": {
            "monthly": {
                "price_id": PRICE_IDS["business_monthly"],
                "amount": 19900,  # $199.00
                "currency": "usd",
                "interval": "month",
                "jabl_tokens": JABL_TOKENS["business"],
                "api_limit": API_LIMITS["business"]
            },
            "yearly": {
                "price_id": PRICE_IDS["business_yearly"],
                "amount": 199000,  # $1,990.00
                "currency": "usd",
                "interval": "year",
                "jabl_tokens": JABL_TOKENS["business"],
                "api_limit": API_LIMITS["business"]
            }
        },
        "enterprise": {
            "monthly": {
                "price_id": PRICE_IDS["enterprise_monthly"],
                "amount": 99900,  # $999.00
                "currency": "usd",
                "interval": "month",
                "jabl_tokens": JABL_TOKENS["enterprise"],
                "api_limit": API_LIMITS["enterprise"]
            },
            "yearly": {
                "price_id": PRICE_IDS["enterprise_yearly"],
                "amount": 999000,  # $9,990.00
                "currency": "usd",
                "interval": "year",
                "jabl_tokens": JABL_TOKENS["enterprise"],
                "api_limit": API_LIMITS["enterprise"]
            }
        }
    }


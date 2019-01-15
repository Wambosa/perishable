.PHONY: prerequisite test method deploy

# TARGET := 
# ENV := dev || prod

TF_VER :=0.11.11
PROJECT := perishable
METHODS := $(shell ls ./src/api -1 | sed -e 's/\..*$$//')

prerequisite:
	@echo "installing terraform ${TF_VER}"
		wget https://releases.hashicorp.com/terraform/${TF_VER}/terraform_${TF_VER}_linux_amd64.zip > /dev/null 2>&1 \
		&& unzip ./terraform_${TF_VER}_linux_amd64.zip -d . \
		&& rm -f ./terraform_${TF_VER}_linux_amd64.zip \
		&& chmod +x ./terraform \
		&& sudo mv ./terraform /usr/bin/

test:
	@npm test

method:
	@for method in ${METHODS} ; do \
		mkdir -p ./infra/lambda/.build/$$method/node_modules/.bin && \
		cp -r ./infra/lambda/../../node_modules/.bin/* ./infra/lambda/.build/$$method/node_modules/.bin && \
		cp -r ./infra/lambda/../../node_modules/* ./infra/lambda/.build/$$method/node_modules && \
		cp ./infra/lambda/wrapper.js ./infra/lambda/.build/$$method/index.js && \
		cp ./infra/lambda/../../src/api/$$method.js ./infra/lambda/.build/$$method/method.js && \
		cp ./infra/lambda/../../src/api/validate.js ./infra/lambda/.build/$$method/validate.js ;\
	done

deploy:
ifeq ($(TARGET), lambda)
	$(MAKE) -s method
endif
	@rm -f ./infra/${TARGET}/.terraform/terraform.tfstate ;\
		cd ./infra/${TARGET} \
		&& . ../../config/secrets-${ENV}.env \
		&& terraform init -backend-config="bucket=${PROJECT}-${ENV}-terraform-state" \
		&& terraform get \
		&& terraform validate \
		&& terraform apply \
			-var="database_pass=$$DATABASE_PASS" \
			-var="environment=${ENV}" ;\
		cd ../
